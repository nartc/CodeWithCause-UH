export interface IBaseRepository<T> {
    getAll();
    create(newResource: T);
    delete(resourceId: string);
    update(resourceId: string, updatedResource: T);
    getResourceById(resourceId: string);
    getResourcesByIds(resourceIds: string[]);
}