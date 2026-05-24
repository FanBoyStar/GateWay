import Papa from 'papaparse';

export interface CSVRow {
  name: string;
  email: string;
  phone: string;
  ticketType: string;
  seatNumber?: string;
  notes?: string;
  rowNumber: number;
  errors: string[];
}

export interface ParseResult {
  validRows: CSVRow[];
  errorRows: CSVRow[];
  totalRows: number;
  validCount: number;
  errorCount: number;
}

const VALID_TICKET_TYPES = [
  'VIP',
  'General Admission',
  'Speaker',
  'Staff',
  'Press',
];

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRow(row: Record<string, string>, rowNumber: number): CSVRow {
  const errors: string[] = [];

  const name = (row.Name || row.name || row.NAME || '').trim();
  const email = (row.Email || row.email || row.EMAIL || '').trim();
  const phone = (row.Phone || row.phone || row.PHONE || '').trim();
  let ticketType = (row['Ticket Type'] || row.ticketType || row.TicketType || row['Ticket Type'] || 'General Admission').trim();
  const seatNumber = (row.Seat || row.seat || row['Seat Number'] || row.seatNumber || '').trim();
  const notes = (row.Notes || row.notes || row.NOTES || '').trim();

  if (!name) {
    errors.push('Name is required');
  }

  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Invalid email format');
  }

  // Normalize ticket type
  const normalizedTicket = ticketType.toLowerCase();
  const foundType = VALID_TICKET_TYPES.find(
    (t) => t.toLowerCase() === normalizedTicket
  );
  if (foundType) {
    ticketType = foundType;
  } else if (ticketType) {
    // Keep custom ticket type
  } else {
    ticketType = 'General Admission';
  }

  return {
    name,
    email,
    phone,
    ticketType,
    seatNumber,
    notes,
    rowNumber,
    errors,
  };
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, string>[];
        const processedRows: CSVRow[] = rows.map((row, index) =>
          validateRow(row, index + 2)
        );

        const validRows = processedRows.filter((row) => row.errors.length === 0);
        const errorRows = processedRows.filter((row) => row.errors.length > 0);

        resolve({
          validRows,
          errorRows,
          totalRows: processedRows.length,
          validCount: validRows.length,
          errorCount: errorRows.length,
        });
      },
      error: (error) => {
        reject(new Error(error.message));
      },
    });
  });
}

export function generateSampleCSV(): string {
  const sampleData = [
    {
      Name: 'John Doe',
      Email: 'john@example.com',
      Phone: '+1 555-1234',
      'Ticket Type': 'VIP',
      Seat: 'A-12',
      Notes: 'Speaker at event',
    },
    {
      Name: 'Jane Smith',
      Email: 'jane@example.com',
      Phone: '+1 555-5678',
      'Ticket Type': 'General Admission',
      Seat: 'B-05',
      Notes: '',
    },
    {
      Name: 'Mike Johnson',
      Email: 'mike@example.com',
      Phone: '',
      'Ticket Type': 'Staff',
      Seat: '',
      Notes: 'Volunteer',
    },
  ];

  return Papa.unparse(sampleData);
}
