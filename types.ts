
export enum OperationType {
  RAW_MATERIAL = 'Ingreso de materia prima',
  SUPPLIES = 'Ingreso de insumos y material de empaque',
  FINISHED_PRODUCT = 'Despacho de producto terminado'
}

export enum Role {
  ADMIN = 'Administrador',
  SCALE = 'Báscula / Pesaje',
  YARD = 'Inspector de Patio',
  DOCS = 'Documentación',
  OPERATOR = 'Operario de Maniobra'
}

export interface User {
  id: string;
  name: string;
  role: Role;
}

export enum Stage {
  ARRIVAL_ANNOUNCEMENT = 'Anuncio de llegada',
  SCALE_WEIGHING_1 = 'Pesaje en báscula (Entrada)',
  PHYSICAL_INSPECTION = 'Inspección física del vehículo',
  APPROVAL = 'Aprobación de maniobra',
  MANEUVER = 'Maniobra (Cargue/Descargue)',
  FINAL_INSPECTION = 'Inspección final',
  SCALE_WEIGHING_2 = 'Pesaje en báscula (Salida)',
  DOCUMENTATION = 'Elaboración de documentos',
  RELEASE = 'Liberación del vehículo'
}

export interface TrackingEvent {
  id: string;
  stage: Stage;
  timestamp: number;
  recordedBy: string; // Nombre del usuario
  userRole: Role;    // Rol del usuario al momento del registro
  delayReason?: string;
  notes?: string;
  extraData?: any;
}

export interface Vehicle {
  id: string;
  licensePlate: string;
  operation: OperationType;
  currentStage: Stage;
  history: TrackingEvent[];
  entryTime: number;
  exitTime?: number;
  status: 'active' | 'completed';
  
  maneuverType?: 'Cargue' | 'Descargue';
  productName?: string;
  entityName?: string;
  targetQuantity?: number;
  shippedWeight?: number;
  netWeight?: number;
}

export interface AppSettings {
  standardTimes: Record<Stage, number>;
  stageFlows: Record<OperationType, Stage[]>;
  workspaceId: string;
}
