import type { Vehicle, AppSettings } from '../types';

export type VehicleRow = {
  id: string;
  license_plate: string;
  operation: string;
  current_stage: string;
  history: unknown;
  entry_time: number;
  exit_time?: number | null;
  status: string;
  maneuver_type?: string | null;
  product_name?: string | null;
  entity_name?: string | null;
  target_quantity?: number | null;
  shipped_weight?: number | null;
  net_weight?: number | null;
};

export type SettingsRow = {
  id: string;
  standard_times: unknown;
  stage_flows: unknown;
  workspace_id: string;
};

export function rowToVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    licensePlate: row.license_plate,
    operation: row.operation as Vehicle['operation'],
    currentStage: row.current_stage as Vehicle['currentStage'],
    history: Array.isArray(row.history) ? row.history as Vehicle['history'] : [],
    entryTime: row.entry_time,
    exitTime: row.exit_time ?? undefined,
    status: row.status as Vehicle['status'],
    maneuverType: row.maneuver_type as Vehicle['maneuverType'],
    productName: row.product_name ?? undefined,
    entityName: row.entity_name ?? undefined,
    targetQuantity: row.target_quantity ?? undefined,
    shippedWeight: row.shipped_weight ?? undefined,
    netWeight: row.net_weight ?? undefined,
  };
}

export function vehicleToRow(v: Vehicle): VehicleRow {
  return {
    id: v.id,
    license_plate: v.licensePlate,
    operation: v.operation,
    current_stage: v.currentStage,
    history: v.history,
    entry_time: v.entryTime,
    exit_time: v.exitTime ?? null,
    status: v.status,
    maneuver_type: v.maneuverType ?? null,
    product_name: v.productName ?? null,
    entity_name: v.entityName ?? null,
    target_quantity: v.targetQuantity ?? null,
    shipped_weight: v.shippedWeight ?? null,
    net_weight: v.netWeight ?? null,
  };
}

export function rowToSettings(row: SettingsRow): AppSettings {
  return {
    standardTimes: (row.standard_times as AppSettings['standardTimes']) ?? {},
    stageFlows: (row.stage_flows as AppSettings['stageFlows']) ?? {},
    workspaceId: row.workspace_id,
  };
}

export function settingsToRow(s: AppSettings & { id: string }): SettingsRow {
  return {
    id: s.id,
    standard_times: s.standardTimes,
    stage_flows: s.stageFlows,
    workspace_id: s.workspaceId,
  };
}
