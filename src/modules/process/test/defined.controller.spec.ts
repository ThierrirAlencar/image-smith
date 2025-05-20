import { Test, TestingModule } from '@nestjs/testing';
import { DefinedController } from '../defined.controller';

describe('DefinedController', () => {
  let controller: DefinedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefinedController],
    }).compile();

    controller = module.get<DefinedController>(DefinedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
