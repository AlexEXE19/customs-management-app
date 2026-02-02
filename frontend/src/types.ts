export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  entryPurpose: entryPurpose;
  nationality: string;
  homeCity: string;
  documentType: documentType;
  riskLevel: number;
  issueDate: string;
}

type documentType = "Passport" | "National's ID" | "Driving License";
type entryPurpose = "Tourism" | "Business" | "Work" | "Transit" | "Studies";

export interface PersonChecked extends Person {
  chekedDate: string;
  entryApproved: boolean;
  officerId: string;
}

export interface Officer {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  role: possibleRoles;
}

type possibleRoles = "Officer" | "Superintendent";
