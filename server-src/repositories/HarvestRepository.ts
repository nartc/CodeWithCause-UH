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
import {Types} from 'mongoose';
import {IEntryRepository} from './interfaces/IEntryRepository';
import {EntryRepository} from './EntryRepository';
import {Entry} from '../models/Entry';

export class HarvestRepository extends BaseRepository<IHarvest> implements IHarvestRepository {
    private _harvestModel: HarvestModel;

    private readonly organizationRepository: IOrganizationRepository = new OrganizationRepository(Organization);
    private readonly cropRepository: ICropRepository = new CropRepository(Crop);
    private readonly harvesterRepository: IHarvesterRepository = new HarvesterRepository(Harvester);
    private readonly entryRepository: IEntryRepository = new EntryRepository(Entry);

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
            switch (type) {
                case 'organization': {
                    const org = await this.organizationRepository.getResourceById(id);
                    await this._harvestModel.updateMany(
                        {},
                        {$set: {'entries.$[elem].recipient': org}},
                        {
                            arrayFilters: [{'elem.recipient._id': Types.ObjectId(id)}]
                        });

                    await this.entryRepository.updateMany({'recipient._id': Types.ObjectId(id)}, {$set: {recipient: org}});
                    break;
                }
                case 'harvester':
                    const harvester = await this.harvesterRepository.getResourceById(id);
                    await this._harvestModel.updateMany(
                        {},
                        {$set: {'entries.$[elem].harvester': harvester}},
                        {
                            arrayFilters: [{'elem.harvester._id': id}],
                            new: true
                        });
                    await this.entryRepository.updateMany({'harvester._id': Types.ObjectId(id)}, {$set: {harvester}});
                    break;
                case 'crop':
                    const crop = await this.cropRepository.getResourceById(id);
                    await this._harvestModel.updateMany(
                        {},
                        {$set: {'entries.$[elem].crop': crop}},
                        {
                            arrayFilters: [{'elem.crop._id': id}],
                            new: true
                        });
                    await this.entryRepository.updateMany({'crop._id': Types.ObjectId(id)}, {$set: {crop}});
                    break;
                default:
                    break;
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}
