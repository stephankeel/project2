import {BlindsPercentageDownPipe} from "./blinds-percentage-down.pipe";
import {IBlindsData} from "../../../../../../server/entities/data.interface";

describe('BlindsPercentageDownPipe', () => {
  it('create an instance', () => {
    const pipe = new BlindsPercentageDownPipe();
    expect(pipe).toBeTruthy();
  });
  it('test percentageDown attribute of IBlindsData', () => {
    const pipe = new BlindsPercentageDownPipe();
    let blindsData : IBlindsData = {percentageDown: 10};
    expect(pipe.transform(blindsData)).toEqual(10);
  });
  it('test empty IBlindsData', () => {
    const pipe = new BlindsPercentageDownPipe();
    let blindsData : IBlindsData = {};
    expect(pipe.transform(blindsData)).toBeUndefined();
  });
  it('test null', () => {
    const pipe = new BlindsPercentageDownPipe();
    expect(pipe.transform(null)).toBeNull();
  });
});
