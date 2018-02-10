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
import * as passport from 'passport';
import { expressAuthentication } from './middleware/security/passport';

const models: TsoaRoute.Models = {
    "UserRole": {
        "enums": ["Admin", "User"],
    },
    "IUserVm": {
        "properties": {
            "username": { "dataType": "string" },
            "password": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "role": { "ref": "UserRole" },
            "_id": { "dataType": "string" },
        },
    },
    "INewUserParams": {
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
    },
    "ILoginVm": {
        "properties": {
            "authToken": { "dataType": "string", "required": true },
            "username": { "dataType": "string" },
            "role": { "ref": "UserRole" },
            "_id": { "dataType": "string" },
        },
    },
    "ICropVm": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "variety": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "pricePerPound": { "dataType": "double", "required": true },
            "createdOn": { "dataType": "datetime", "required": true },
            "updatedOn": { "dataType": "datetime", "required": true },
            "_id": { "dataType": "string" },
        },
    },
    "IHarvesterVm": {
        "properties": {
            "firstName": { "dataType": "string", "required": true },
            "lastName": { "dataType": "string", "required": true },
            "createdOn": { "dataType": "datetime", "required": true },
            "updatedOn": { "dataType": "datetime", "required": true },
            "_id": { "dataType": "string" },
        },
    },
    "IOrganizationVm": {
        "properties": {
            "purchase": { "dataType": "boolean" },
            "name": { "dataType": "string" },
            "createdOn": { "dataType": "datetime" },
            "updatedOn": { "dataType": "datetime" },
            "contactName": { "dataType": "string" },
            "phoneNumber": { "dataType": "string" },
            "_id": { "dataType": "string" },
        },
    },
    "IEntryVm": {
        "properties": {
            "crop": { "ref": "ICropVm", "required": true },
            "pounds": { "dataType": "double", "required": true },
            "priceTotal": { "dataType": "double", "required": true },
            "harvester": { "ref": "IHarvesterVm", "required": true },
            "comments": { "dataType": "string", "required": true },
            "recipient": { "ref": "IOrganizationVm", "required": true },
            "createdOn": { "dataType": "datetime", "required": true },
            "updatedOn": { "dataType": "datetime", "required": true },
            "selectedVariety": { "dataType": "string", "required": true },
            "_id": { "dataType": "string" },
        },
    },
    "INewEntryParams": {
        "properties": {
            "pounds": { "dataType": "double", "required": true },
            "crop": { "dataType": "string" },
            "priceTotal": { "dataType": "double" },
            "harvester": { "dataType": "string" },
            "comments": { "dataType": "string" },
            "farm": { "dataType": "string" },
            "recipient": { "dataType": "string" },
            "selectedVariety": { "dataType": "string" },
        },
    },
    "IFarmVm": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "lat": { "dataType": "double", "required": true },
            "lng": { "dataType": "double", "required": true },
            "createdOn": { "dataType": "datetime", "required": true },
            "updatedOn": { "dataType": "datetime", "required": true },
            "_id": { "dataType": "string" },
        },
    },
    "INewFarmParams": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "lat": { "dataType": "double", "required": true },
            "lng": { "dataType": "double", "required": true },
        },
    },
    "INewCropParams": {
        "properties": {
            "name": { "dataType": "string", "required": true },
            "variety": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
            "pricePerPound": { "dataType": "double", "required": true },
        },
    },
    "INewHarvesterParams": {
        "properties": {
            "lastName": { "dataType": "string", "required": true },
            "firstName": { "dataType": "string", "required": true },
        },
    },
    "INewOrganizationParams": {
        "properties": {
            "purchase": { "dataType": "boolean", "required": true },
            "name": { "dataType": "string", "required": true },
            "contactName": { "dataType": "string", "required": true },
            "phoneNumber": { "dataType": "string", "required": true },
        },
    },
    "IHarvestVm": {
        "properties": {
            "farm": { "ref": "IFarmVm", "required": true },
            "entries": { "dataType": "array", "array": { "ref": "IEntryVm" }, "required": true },
            "createdOn": { "dataType": "datetime", "required": true },
            "updatedOn": { "dataType": "datetime", "required": true },
            "_id": { "dataType": "string" },
        },
    },
    "INewHarvestParams": {
        "properties": {
            "entries": { "dataType": "array", "array": { "ref": "INewEntryParams" }, "required": true },
            "farm": { "dataType": "string", "required": true },
        },
    },
};

export function RegisterRoutes(app: any) {
    app.post('/api/users/create',
        function(request: any, response: any, next: any) {
            const args = {
                newUserParams: { "in": "body", "name": "newUserParams", "required": true, "ref": "INewUserParams" },
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
                loginParams: { "in": "body", "name": "loginParams", "required": true, "ref": "INewUserParams" },
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
    app.post('/api/entries/create',
        function(request: any, response: any, next: any) {
            const args = {
                newEntryParams: { "in": "body", "name": "newEntryParams", "required": true, "ref": "INewEntryParams" },
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
    app.post('/api/farms/create',
        function(request: any, response: any, next: any) {
            const args = {
                newFarmParams: { "in": "body", "name": "newFarmParams", "required": true, "ref": "INewFarmParams" },
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
                newFarmParams: { "in": "body", "name": "newFarmParams", "required": true, "ref": "INewFarmParams" },
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
                newCropParams: { "in": "body", "name": "newCropParams", "required": true, "ref": "INewCropParams" },
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
    app.post('/api/harvesters/create',
        function(request: any, response: any, next: any) {
            const args = {
                newHarvesterParams: { "in": "body", "name": "newHarvesterParams", "required": true, "ref": "INewHarvesterParams" },
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
    app.post('/api/organization/create',
        function(request: any, response: any, next: any) {
            const args = {
                newOrganizationParams: { "in": "body", "name": "newOrganizationParams", "required": true, "ref": "INewOrganizationParams" },
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
                newOrganizationParams: { "in": "body", "name": "newOrganizationParams", "required": true, "ref": "INewOrganizationParams" },
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
                newHarvestParams: { "in": "body", "name": "newHarvestParams", "required": true, "ref": "INewHarvestParams" },
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
