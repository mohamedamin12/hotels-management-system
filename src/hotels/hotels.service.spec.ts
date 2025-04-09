import { Repository } from "typeorm";
import { HotelsService } from "./hotels.service";
import { Hotel } from "./entities/hotel.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateHotelDto } from "./dto/create-hotel.dto";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "../users/users.service";
import { I18nContext } from 'nestjs-i18n';
type HotelTestType = { id: string, name: string, location: string, description: string, rating: number };
type Options = { where: { name?: string, location?: string, pageNumber?: number, perPage?: number } };
type FindOneParam = { where: { id: string } }

describe('HotelsService', () => {
  let hotelsService: HotelsService;
  let hotelsRepository: Repository<Hotel>;
  let i18n: jest.Mocked<I18nContext>;
  const REPOSITORY_TOKEN = getRepositoryToken(Hotel);
  const createHotelDto: CreateHotelDto =
  {
    name: "test",
    location: "test",
    description: "test",
    rating: 1
  }

  let hotels: HotelTestType[];

  beforeEach(async () => {
    hotels = [
      {
        id: "1",
        name: "h1",
        location: "test",
        description: "about this hotel",
        rating: 5
      },
      {
        id: "2",
        name: "h2",
        location: "test",
        description: "about this hotel",
        rating: 5
      },
      {
        id: "3",
        name: "h3",
        location: "test",
        description: "about this hotel",
        rating: 5
      },
    ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HotelsService,
        {
          provide: UsersService,
          useValue: {
            getCurrentUser: jest.fn((userId: string) => Promise.resolve({ id: userId }))
          }
        },
        {
          provide: REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn((dto: CreateHotelDto) => dto),
            save: jest.fn((dto: CreateHotelDto) => Promise.resolve({ ...dto, id: 1 })),
            find: jest.fn((options?: Options) => {
              if (options.where.name) return Promise.resolve([hotels[0], hotels[1]]);
              return Promise.resolve(hotels);
            }),
            findOne: jest.fn((param: FindOneParam) => Promise.resolve(hotels.find(p => p.id === param.where.id))),
            remove: jest.fn((hotel: Hotel) => {
              const index = hotels.findIndex(h => h.id === hotel.id);
              if (index !== -1) {
                hotels.splice(index, 1);
                return Promise.resolve(true);
              }
              return Promise.resolve(false);
            })
          }
        },
        {
          provide: I18nContext,
          useValue: {
            t: jest.fn().mockResolvedValue('Translated message'),
          },
        }
      ]
    }).compile()


    hotelsService = module.get<HotelsService>(HotelsService);
    hotelsRepository = module.get<Repository<Hotel>>(REPOSITORY_TOKEN);
    i18n = module.get(I18nContext);

  })

  it("should hotels service be defined", () => {
    expect(hotelsService).toBeDefined();
  });

  it("should hotels Repository  be defined", () => {
    expect(hotelsRepository).toBeDefined();
  });

  // Create new Hotel Tests
  describe("createHotel()", () => {
    it("should call 'create' method in hotel repository", async () => {
      await hotelsService.create(createHotelDto, i18n)
      expect(hotelsRepository.create).toHaveBeenCalled();
      expect(hotelsRepository.create).toHaveBeenCalledTimes(1);
    })

    it("should call 'save' method in hotel repository", async () => {
      await hotelsService.create(createHotelDto, i18n);
      expect(hotelsRepository.save).toHaveBeenCalled();
      expect(hotelsRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  // Get all hotels
  describe('getAll()', () => {

    it("should return 2 hotels if an argument passed", async () => {
      const data = await hotelsService.findAll("TestHotel");
      console.log(data)
      expect(data).toHaveLength(2);
    });

  });

  // Get single hotel by id
  describe('getOneBy()', () => {

    it("should call 'findOne' method in hotel repository", async () => {
      await hotelsService.findById("1", i18n);
      expect(hotelsRepository.findOne).toHaveBeenCalled();
      expect(hotelsRepository.findOne).toHaveReturnedTimes(1);
    });

    it("should return a hotel with the given id", async () => {
      const hotel = await hotelsService.findById("1", i18n);
      expect(hotel).toMatchObject(hotels[0]);
    });

  });


  // Update hotel
  describe('update()', () => {
    const title = "hotel updated";
    const name = "hotel updated";
    it("should call 'save' method in hotel repository and update the hotel", async () => {
      const result = await hotelsService.update("1", { name }, i18n);
      expect(hotelsRepository.save).toHaveBeenCalled();
      expect(hotelsRepository.save).toHaveBeenCalledTimes(1);
      expect(result.name).toBe(title);
    });


  });


  // Delete hotel
  describe('delete()', () => {
    it("should call 'remove' method in hotel repository", async () => {
      await hotelsService.remove("1", i18n);
      expect(hotelsRepository.remove).toHaveBeenCalled();
      expect(hotelsRepository.remove).toHaveBeenCalledTimes(1);
    });

    it("should remove the hotel and return the success message", async () => {
      const result = await hotelsService.remove("1", i18n);
      expect(result).toMatchObject({ message: 'hotel deleted successfully' });
    });


  });

})
