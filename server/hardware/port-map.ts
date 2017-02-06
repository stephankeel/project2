export enum Port {
  DI_1, DI_2, DI_3, DI_4, DI_5, DI_6, DI_7, DI_8,
  DO_1, DO_2, DO_3, DO_4, DO_5, DO_6, DO_7, DO_8,
  AI_1, AI_2, AI_3, AI_4, AI_5, AI_6, AI_7
}

export const digitalInputs: Port[] = [Port.DI_1, Port.DI_2, Port.DI_3, Port.DI_4, Port.DI_5, Port.DI_6, Port.DI_7, Port.DI_8];

export const digitalOutputs: Port[] = [Port.DO_1, Port.DO_2, Port.DO_3, Port.DO_4, Port.DO_5, Port.DO_6, Port.DO_7, Port.DO_8];

export const analogInputs: Port[] = [Port.AI_1, Port.AI_2, Port.AI_3, Port.AI_4, Port.AI_5, Port.AI_6, Port.AI_7];

export function portName(port: Port): string {
  let p: {[index: string]: any} = Port;
  return p[port];
}

export const enum PortType {
  DIGITAL_INPUT,
  DIGITAL_OUTPUT,
  ANALOG_INPUT
}

export function portType(port: Port): PortType {
  if (port >= Port.DI_1 && port <= Port.DI_8) {
    return PortType.DIGITAL_INPUT;
  } else if (port >= Port.DO_1 && port <= Port.DO_8) {
    return PortType.DIGITAL_OUTPUT;
  } else if (port >= Port.AI_1 && port <= Port.AI_7) {
    return PortType.ANALOG_INPUT;
  }
  return null;
}
