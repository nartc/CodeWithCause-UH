/* tslint:disable */
import { error } from 'util';

import { Controller, ValidateParam, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { UserController } from './controllers/UserController';
import { EntryController } from './controllers/EntryController';
import { FarmController } from './controllers/FarmController';
import { CropController } from './controllers/CropController';
import { HarvesterController } from './controllers/HarvesterController';
import { OrganizationController } from './controllers/OrganizationController';
import { HarvestController } from './controllers/HarvestController';
import { ReportingController } from './controllers/ReportingController';
import { SystemController } from './controllers/SystemController';
import * as passport from 'passport';
import { expressAuthentication } from './middleware/security/passport';
import * as multer from 'multer';
const upload = multer();

const models: TsoaRoute.Models = {
    "UserRole": {
        "enums": ["Admin", "User"],
    },
    "UserVm": {
        "properties": {
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "_id": { "dataType": "string" },
            "username": { "dataType": "string" },
            "password": { "dataType": "string" },
            "role": { "ref": "UserRole" },
        },
    },
    "NewUserParams": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "role": { "ref": "UserRole", "required": true },
        },
    },
    "LoginVm": {
        "properties": {
            "authToken": { "dataType": "string", "required": true },
            "username": { "dataType": "string" },
            "role": { "ref": "UserRole" },
            "_id": { "dataType": "string" },
        },
    },
    "LoginParams": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "CropVm": {
        "properties": {
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "_id": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
            "variety": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "pricePerPound": { "dataType": "double", "required": true },
        },
    },
    "HarvesterVm": {
        "properties": {
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "_id": { "dataType": "string" },
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
        },
    },
    "OrganizationType": {
        "enums": ["Purchased", "Donated", "Internal"],
    },
    "OrganizationVm": {
        "properties": {
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "_id": { "dataType": "string" },
            "orgType": { "ref": "OrganizationType" },
            "name": { "dataType": "string" },
        },
    },
    "EntryVm": {
        "properties": {
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "_id": { "dataType": "string" },
            "crop": { "ref": "CropVm", "required": true },
            "pounds": { "dataType": "double", "required": true },
            "priceTotal": { "dataType": "double", "required": true },
            "harvester": { "ref": "HarvesterVm", "required": true },
            "comments": { "dataType": "string", "required": true },
            "recipient": { "ref": "OrganizationVm", "required": true },
            "selectedVariety": { "dataType": "string", "required": true },
        },
    },
    "NewEntryParams": {
        "properties": {
            "pounds": { "dataType": "double", "required": true },
            "cropId": { "dataType": "string" },
            "harvesterId": { "dataType": "string" },
            "comments": { "dataType": "string" },
            "recipientId": { "dataType": "string" },
            "selectedVariety": { "dataType": "string" },
        },
    },
    "FarmVm": {
        "properties": {
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "_id": { "dataType": "string" },
            "name": { "dataType": "string", "required": true },
            "lat": { "dataType": "double", "required": true },
            "lng": { "dataType": "double", "required": true },
        },
    },
    "HarvestVm": {
        "properties": {
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "_id": { "dataType": "string" },
            "farm": { "ref": "FarmVm", "required": true },
            "entries": { "dataType": "array", "array": { "ref": "EntryVm" }, "required": true },
        },
    },
    "NewFarmParams": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "lat": { "dataType": "double", "required": true },
            "lng": { "dataType": "double", "required": true },
        },
    },
    "NewCropParams": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "variety": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "pricePerPound": { "dataType": "double", "required": true },
        },
    },
    "NewHarvesterParams": {
        "properties": {
            "lastName": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
        },
    },
    "NewOrganizationParams": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "orgType": { "ref": "OrganizationType" },
        },
    },
    "HarvestParams": {
        "properties": {
            "farmId": { "dataType": "string", "required": true },
            "entriesIds": { "dataType": "array", "array": { "dataType": "string" } },
            "harvestId": { "dataType": "string" },
        },
    },
    "PercentageReportType": {
        "enums": ["Purchased", "Donated"],
    },
    "PercentageReportResponse": {
        "properties": {
            "type": { "ref": "PercentageReportType" },
            "createdOn": { "dataType": "datetime" },
            "percentage": { "dataType": "string" },
        },
    },
    "PercentageByFarmReportResponse": {
        "properties": {
            "farmName": { "dataType": "string", "required": true },
            "pounds": { "dataType": "double", "required": true },
            "total": { "dataType": "double", "required": true },
            "percentageByEntry": { "dataType": "string", "required": true },
            "percentageByPound": { "dataType": "string", "required": true },
            "percentageByPrice": { "dataType": "string", "required": true },
        },
    },
    "PercentageByFarm": {
        "properties": {
            "reportType": { "ref": "PercentageReportType", "required": true },
            "dateRange": { "dataType": "array", "array": { "dataType": "datetime" } },
        },
    },
    "ValueReportResponse": {
        "properties": {
            "farmName": { "dataType": "string", "required": true },
            "value": { "dataType": "double", "required": true },
        },
    },
    "WeightValueReportType": {
        "enums": ["Weight", "Value"],
    },
    "ReportByFarm": {
        "properties": {
            "valueReportType": { "ref": "WeightValueReportType", "required": true },
            "dateRange": { "dataType": "array", "array": { "dataType": "datetime" } },
        },
    },
    "ClearDbResponse": {
        "properties": {
            "result": { "dataType": "any", "required": true },
            "connection": { "dataType": "any" },
            "deletedCount": { "dataType": "double" },
            "collection": { "dataType": "string" },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.post('/api/users/addImage',
        upload.single('image'),
        function(request: any, response: any, next: any) {
            const args = {
                image: { "in": "formData", "name": "image", "required": true, "dataType": "file" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.addImage.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/users/create',
        function(request: any, response: any, next: any) {
            const args = {
                newUserParams: { "in": "body", "name": "newUserParams", "required": true, "ref": "NewUserParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.registerUser.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/users/:username',
        function(request: any, response: any, next: any) {
            const args = {
                username: { "in": "path", "name": "username", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.getUserByUsername.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/users/login',
        function(request: any, response: any, next: any) {
            const args = {
                loginParams: { "in": "body", "name": "loginParams", "required": true, "ref": "LoginParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.login.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/users',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.getAllUsers.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/users/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.deleteUserById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/users/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                updateUserParams: { "in": "body", "name": "updateUserParams", "required": true, "ref": "NewUserParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new UserController();


            const promise = controller.udpateUserById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/entries/create',
        function(request: any, response: any, next: any) {
            const args = {
                newEntryParams: { "in": "body", "name": "newEntryParams", "required": true, "ref": "NewEntryParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new EntryController();


            const promise = controller.registerEntry.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/entries/getAll',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new EntryController();


            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/entries/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new EntryController();


            const promise = controller.getSingleEntry.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/entries/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                updatedEntryParams: { "in": "body", "name": "updatedEntryParams", "required": true, "ref": "NewEntryParams" },
                harvestId: { "in": "query", "name": "harvestId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new EntryController();


            const promise = controller.updateEntry.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/entries/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new EntryController();


            const promise = controller.deleteEntry.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/farms/create',
        function(request: any, response: any, next: any) {
            const args = {
                newFarmParams: { "in": "body", "name": "newFarmParams", "required": true, "ref": "NewFarmParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FarmController();


            const promise = controller.registerFarm.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/farms/getAll',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FarmController();


            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/farms/:id',
        authenticateMiddleware([{ "name": "JWT" }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FarmController();


            const promise = controller.deleteById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/farms/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                newFarmParams: { "in": "body", "name": "newFarmParams", "required": true, "ref": "NewFarmParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new FarmController();


            const promise = controller.updateById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/crops/create',
        function(request: any, response: any, next: any) {
            const args = {
                newCropParams: { "in": "body", "name": "newCropParams", "required": true, "ref": "NewCropParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new CropController();


            const promise = controller.registerCrop.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/crops/getAll',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new CropController();


            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/crops/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new CropController();


            const promise = controller.getSingleCrop.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/crops/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                updateCropParams: { "in": "body", "name": "updateCropParams", "required": true, "ref": "NewCropParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new CropController();


            const promise = controller.updateCrop.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/crops/:id',
        authenticateMiddleware([{ "name": "JWT" }]),
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new CropController();


            const promise = controller.deleteCrop.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/harvesters/create',
        function(request: any, response: any, next: any) {
            const args = {
                newHarvesterParams: { "in": "body", "name": "newHarvesterParams", "required": true, "ref": "NewHarvesterParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HarvesterController();


            const promise = controller.registerHarvester.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/harvesters/getAll',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HarvesterController();


            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/harvesters/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HarvesterController();


            const promise = controller.deleteHarvesterById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/organization/create',
        function(request: any, response: any, next: any) {
            const args = {
                newOrganizationParams: { "in": "body", "name": "newOrganizationParams", "required": true, "ref": "NewOrganizationParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new OrganizationController();


            const promise = controller.registerOrganization.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/organization/getAll',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new OrganizationController();


            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/organization/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                newOrganizationParams: { "in": "body", "name": "newOrganizationParams", "required": true, "ref": "NewOrganizationParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new OrganizationController();


            const promise = controller.updateOrganization.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.delete('/api/organization/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new OrganizationController();


            const promise = controller.deleteOrganization.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/harvests/create',
        function(request: any, response: any, next: any) {
            const args = {
                harvestParams: { "in": "body", "name": "harvestParams", "required": true, "ref": "HarvestParams" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HarvestController();


            const promise = controller.registerHarvest.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/harvests/getAll',
        function(request: any, response: any, next: any) {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HarvestController();


            const promise = controller.getAll.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/harvests/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HarvestController();


            const promise = controller.getHarvestById.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.put('/api/harvests/:id',
        function(request: any, response: any, next: any) {
            const args = {
                id: { "in": "path", "name": "id", "required": true, "dataType": "string" },
                farmId: { "in": "query", "name": "farmId", "required": true, "dataType": "string" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new HarvestController();


            const promise = controller.updateFarm.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/reports/percentage',
        function(request: any, response: any, next: any) {
            const args = {
                percentageType: { "in": "query", "name": "percentageType", "required": true, "dataType": "enum", "enums": ["Purchased", "Donated"] },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ReportingController();


            const promise = controller.getSalesPercentage.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/reports/percentageByFarm',
        function(request: any, response: any, next: any) {
            const args = {
                percentageByFarmParams: { "in": "body", "name": "percentageByFarmParams", "required": true, "ref": "PercentageByFarm" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ReportingController();


            const promise = controller.getPercentageByFarm.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.post('/api/reports/total',
        function(request: any, response: any, next: any) {
            const args = {
                reportParams: { "in": "body", "name": "reportParams", "required": true, "ref": "ReportByFarm" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ReportingController();


            const promise = controller.getTotalWeightOrValue.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/reports/test',
        function(request: any, response: any, next: any) {
            const args = {
                dateStart: { "in": "query", "name": "dateStart", "required": true, "dataType": "datetime" },
                dateEnd: { "in": "query", "name": "dateEnd", "required": true, "dataType": "datetime" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new ReportingController();


            const promise = controller.getTest.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/system/importCrops',
        authenticateMiddleware([{ "name": "JWT" }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new SystemController();


            const promise = controller.importCrops.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });
    app.get('/api/system/clearDatabase',
        authenticateMiddleware([{ "name": "JWT" }]),
        function(request: any, response: any, next: any) {
            const args = {
                request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
                collection: { "in": "query", "name": "collection", "required": true, "dataType": "array", "enums": ["crops", "entries", "farms", "harvesters", "harvests", "organizations", "users"] },
                dropUser: { "default": false, "in": "query", "name": "dropUser", "dataType": "boolean" },
            };

            let validatedArgs: any[] = [];
            try {
                validatedArgs = getValidatedArgs(args, request);
            } catch (err) {
                return next(err);
            }

            const controller = new SystemController();


            const promise = controller.clearDatabase.apply(controller, validatedArgs);
            promiseHandler(controller, promise, response, next);
        });

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return expressAuthentication(security[0].name);
    }

    function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode;
                if (controllerObj instanceof Controller) {
                    const controller = controllerObj as Controller
                    const headers = controller.getHeaders();
                    Object.keys(headers).forEach((name: string) => {
                        response.set(name, headers[name]);
                    });

                    statusCode = controller.getStatus();
                }

                if (data) {
                    response.status(statusCode || 200).json(data);
                } else {
                    response.status(statusCode || 204).end();
                }
            })
            .catch((error: any) => response.status(500).json(error));
    }

    function getValidatedArgs(args: any, request: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(function(key) {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return ValidateParam(args[key], request.query[name], models, name, errorFields);
                case 'path':
                    return ValidateParam(args[key], request.params[name], models, name, errorFields);
                case 'header':
                    return ValidateParam(args[key], request.header(name), models, name, errorFields);
                case 'body':
                    return ValidateParam(args[key], request.body, models, name, errorFields);
                case 'body-prop':
                    return ValidateParam(args[key], request.body[name], models, name, errorFields);
                case 'formData':
                    return ValidateParam(args[key], request.file, models, name, errorFields);
            }
        });

        if (Object.keys(errorFields).length > 0) {
            throw new ValidateError(errorFields, '');
        }
        return values;
    }
}
