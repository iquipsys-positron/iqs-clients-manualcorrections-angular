import { ICorrectionsViewModel } from './ICorrectionsViewModel';
import { CorrectionsModel } from './CorrectionsModel';

class CorrectionsHistoryViewModel implements ICorrectionsViewModel {
    private _filter: any;
    private correctionsModel: CorrectionsModel;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsCorrectionsData: iqs.shell.ICorrectionsDataService
    ) {
        "ngInject";

        this._filter = null;
        this.correctionsModel = new CorrectionsModel($log, $location, $timeout, pipTransaction, iqsOrganization, iqsCorrectionsData);
    }

    private getFilter(): any {
        if (!this._filter || !angular.isObject(this._filter)) {
            this._filter = {};
        }

        if (!this._filter.status) {
            this._filter.statuses = '' + iqs.shell.CorrectionStatus.Approved + ',' + iqs.shell.CorrectionStatus.Rejected;
        }

        if (!this._filter.take) {
            this._filter.take = 100;
        }

        if (!this._filter.skip) {
            this._filter.skip = 0;
        }

        if (this._filter.total === undefined) {
            this._filter.total = false;
        }

        return this._filter;
    }

    public read(successCallback?: (data: iqs.shell.Correction[]) => void, errorCallback?: (error: any) => void) {
        this.correctionsModel.filter = this.getFilter();
        this.correctionsModel.read(successCallback, errorCallback);
    }

    public reload(successCallback?: (data: iqs.shell.Correction[]) => void, errorCallback?: (error: any) => void): void {
        this.correctionsModel.filter = this._filter;
        this.correctionsModel.reload(successCallback, errorCallback);
    }

    public getCollection(localSearch?: string): iqs.shell.Correction[] {
        return this.correctionsModel.get();
    }

    public get collection(): iqs.shell.Correction[] {
        return this.correctionsModel.corrections;
    }

    public getTransaction(): pip.services.Transaction {
        return this.correctionsModel.getTransaction();
    }

    public get isSort(): boolean {
        return this.correctionsModel.isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this.correctionsModel.isSort = value;
        }
    }

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get state(): string {
        return this.correctionsModel.state;
    }

    public set state(value: string) {
        this.correctionsModel.state = value;
    }

    public selectItem(index?: number) {
        this.correctionsModel.selectItem(index);
    }

    public getSelectedItem(): iqs.shell.Correction {
        return this.correctionsModel.getSelectedItem();
    }

    public get selectedIndex(): number {
        return this.correctionsModel.getSelectedIndex();
    }

    public set selectedIndex(index: number) {
        this.correctionsModel.selectItem(index);
    }

    public removeItem(id: string) {
        this.correctionsModel.remove(id);
    }

    public create(correction: iqs.shell.Correction, successCallback?: (data: iqs.shell.Correction) => void, errorCallback?: (error: any) => void): void {
        this.correctionsModel.create(correction, successCallback, errorCallback);
    }

    public deleteCorrectionById(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.correctionsModel.delete(id, successCallback, errorCallback);
    }

    public updateCorrectionById(id: string, correction: iqs.shell.Correction, successCallback?: (data: iqs.shell.Correction) => void, errorCallback?: (error: any) => void): void {
        this.correctionsModel.update(id, correction, successCallback, errorCallback);
    }

    public clean(): void {
        this.correctionsModel.clean();
    } 

}


angular.module('iqsCorrectionsHistory.ViewModel', ['iqsCorrections.Data'])
    .service('iqsCorrectionsHistoryViewModel', CorrectionsHistoryViewModel);

