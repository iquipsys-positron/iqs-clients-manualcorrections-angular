export interface ICorrectionsViewModel {
    state: string;
    isSort: boolean;
    filter: any;
    selectedIndex: number;

    collection: iqs.shell.Correction[];

    read(successCallback?: (data: iqs.shell.Correction[]) => void, errorCallback?: (error: any) => void);
    reload(successCallback?: (data: iqs.shell.Correction[]) => void, errorCallback?: (error: any) => void): void;
    getCollection(): iqs.shell.Correction[];
    getTransaction(): pip.services.Transaction;
    selectItem(index?: number): void;
    getSelectedItem(): iqs.shell.Correction;

    removeItem(id: string): void;
    create(eventTemplate: iqs.shell.Correction, successCallback?: (data: iqs.shell.Correction) => void, errorCallback?: (error: any) => void): void;
    deleteCorrectionById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void;
    updateCorrectionById(id: string, eventTemplate: iqs.shell.Correction, successCallback?: (data: iqs.shell.Correction) => void, errorCallback?: (error: any) => void): void;
    clean(): void;
}
