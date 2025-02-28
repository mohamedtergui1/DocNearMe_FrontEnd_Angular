export enum WasteType {
    Plastic = 'Plastic',
    Glass = 'Glass',
    Paper = 'Paper',
    Metal = 'Metal',
  }
  
  export enum RequestStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    InProgress = 'in progress',
    Completed = 'completed',
    Rejected = 'rejected',
  }
  

  export interface WasteItem {
    type: WasteType;
    kilos: number;
    image?: string;
  }
  
  export interface CollectionRequest {
    id: string;
    userId: string;
    collectorId?: string;
    status: RequestStatus;
    wastes: WasteItem[];
    address: {
      street: string;
      city: string;
    };
    date: Date;
    timeSlot: string;
    notes?: string;
    
  }