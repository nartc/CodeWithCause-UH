import {IHarvestRepository} from './interfaces/IHarvestRepository';
import {HarvestModel, IHarvest} from '../models/Harvest';
import {BaseRepository} from './BaseRepository';
import {CropRepository} from './CropRepository';
import {OrganizationRepository} from './OrganizationRepository';
import {HarvesterRepository} from './HarvesterRepository';
import {Crop} from '../models/Crop';
import {Harvester} from '../models/Harvester';
import {IOrganizationRepository} from './interfaces/IOrganizationRepository';
import {IHarvesterRepository} from './interfaces/IHarvesterRepository';
import {Organization} from '../models/Organization';
import {ICropRepository} from './interfaces/ICropRepository';

export class HarvestRepository extends BaseRepository<IHarvest> implements IHarvestRepository {
    private _harvestModel: HarvestModel;

    private readonly organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly harvesterRepository: IHarvesterRepository = new HarvesterRepository(Harvester);

    constructor(harvestModel: HarvestModel) {
        super(harvestModel);
        this._harvestModel = harvestModel;
    }

    async getHarvestByFarmId(farmId: string): Promise<IHarvest> {
        return this._harvestModel.findOne({'farm._id': farmId}).exec() as any;
    }

    async getHarvestByDateRange(dateRange: Date[]): Promise<IHarvest[]> {
        const [dateStart, dateEnd] = dateRange;
        return this._harvestModel.find({createdOn: {$gte: dateStart, $lte: dateEnd}}).exec() as any;
    }

    async syncDataOnUpdate(id: string, type?: 'harvester' | 'crop' | 'organization'): Promise<boolean> {
        try {
            const harvests = await this.getAll();
            harvests.forEach(async (harvest) => {
                harvest.entries.forEach(async (entry) => {
                    switch (type) {
                        case 'harvester':
                            if (entry.harvester._id === id) {
                                entry.harvester = await this.harvesterRepository.getResourceById(id);
                            }
                            break;
                        case 'crop':
                            if (entry.crop._id === id) {
                                entry.crop = await this.cropRepository.getResourceById(id);
                            }
                            break;
                        case 'organization':
                            if (entry.recipient._id === id) {
                                entry.recipient = await this.organizationRepository.getResourceById(id);
                            }
                            break;
                        default:
                            return false;
                    }
                });
                await harvest.save();
            });
            return true;
        } catch (e) {
            return false;
        }
    }
}
