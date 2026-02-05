
import { Stage, OperationType } from './types';

export const DEFAULT_STAGE_FLOWS: Record<OperationType, Stage[]> = {
  [OperationType.RAW_MATERIAL]: [
    Stage.ARRIVAL_ANNOUNCEMENT,
    Stage.SCALE_WEIGHING_1,
    Stage.PHYSICAL_INSPECTION,
    Stage.APPROVAL,
    Stage.MANEUVER,
    Stage.FINAL_INSPECTION,
    Stage.SCALE_WEIGHING_2,
    Stage.DOCUMENTATION,
    Stage.RELEASE,
  ],
  [OperationType.SUPPLIES]: [
    Stage.ARRIVAL_ANNOUNCEMENT,
    Stage.SCALE_WEIGHING_1,
    Stage.PHYSICAL_INSPECTION,
    Stage.APPROVAL,
    Stage.MANEUVER,
    Stage.FINAL_INSPECTION,
    Stage.SCALE_WEIGHING_2,
    Stage.DOCUMENTATION,
    Stage.RELEASE,
  ],
  [OperationType.FINISHED_PRODUCT]: [
    Stage.ARRIVAL_ANNOUNCEMENT,
    Stage.SCALE_WEIGHING_1,
    Stage.PHYSICAL_INSPECTION,
    Stage.APPROVAL,
    Stage.MANEUVER,
    Stage.FINAL_INSPECTION,
    Stage.SCALE_WEIGHING_2,
    Stage.DOCUMENTATION,
    Stage.RELEASE,
  ],
};

export const PRODUCTS_LOAD = ['Sulfónico', 'Sulphex 1', 'Sulphex 2', 'Sulfanol'];
export const MATERIALS_UNLOAD = ['Alcano propio', 'Alcano maquila', 'Alcohol 1', 'Alcohol 2', 'Alcohol 0', 'Soda'];

export const DEFAULT_STANDARD_TIMES: Record<Stage, number> = {
  [Stage.ARRIVAL_ANNOUNCEMENT]: 10,
  [Stage.SCALE_WEIGHING_1]: 15,
  [Stage.PHYSICAL_INSPECTION]: 20,
  [Stage.APPROVAL]: 10,
  [Stage.MANEUVER]: 60,
  [Stage.FINAL_INSPECTION]: 15,
  [Stage.SCALE_WEIGHING_2]: 15,
  [Stage.DOCUMENTATION]: 20,
  [Stage.RELEASE]: 5,
};

export const DELAY_CAUSES = [
  'Congestión en báscula',
  'Falta de operarios',
  'Problemas técnicos/mecánicos',
  'Error en documentación',
  'Clima adverso',
  'Inspección fallida (re-trabajo)',
  'Otro'
];

export const MOCK_VEHICLES: any[] = [];
