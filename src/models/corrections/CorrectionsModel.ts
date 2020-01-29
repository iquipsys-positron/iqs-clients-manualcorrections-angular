export let UpdateCorrectionEvent = 'iqsUpdateCorrectionEntity';

export class CorrectionsModel {
    private _state: string;
    private _isSort: boolean;
    private _filter: any;

    public corrections: iqs.shell.Correction[];

    private selectIndex: number;
    private selectedItem: iqs.shell.Correction;
    private transaction: pip.services.Transaction;

    constructor(
        private $log: ng.ILogService,
        private $location: ng.ILocationService,
        private $timeout: ng.ITimeoutService,
        private pipTransaction: pip.services.ITransactionService,
        private iqsOrganization: iqs.shell.IOrganizationService,
        private iqsCorrectionsData: iqs.shell.ICorrectionsDataService
    ) {
        "ngInject";
        this.transaction = pipTransaction.create('CORRECTIONS');
        this.corrections = [];
    }

    // private operation
    private updateItemInCollection(item: iqs.shell.Correction): void {
        let index: number = _.findIndex(this.corrections, (ev) => {
            return ev.id == item.id;
        });

        // insert event without sort
        if (index > -1) {
            this.corrections[index] = item;
            if (this.isSort) {
                this.sortCollection(this.corrections);
            }
            if (this.selectedItem) {
                if (this.selectedItem.id != item.id) {
                    this.selectItem(0);
                }
            } else {
                this.selectItem(index);
            }
        } else {
            if (this._isSort) {
                index = _.findIndex(this.corrections, (ev: iqs.shell.Correction) => {
                    return moment(ev.create_time).toDate().getTime() < moment(item.create_time).toDate().getTime();
                });
                if (index > -1) {
                    this.corrections.splice(index, 0, item);
                } else {
                    this.corrections.push(item);
                    index = this.corrections.length - 1;
                }
            } else {
                this.corrections.unshift(item);
                index = 0;
            }

            this.selectItem(index);
        }

        this.collectionChanged();
    }

    private collectionChanged() {
        // this.$timeout(() => {
        this.setState();
        // }, 10);
        // send broadcast ???
    }

    private setState() {
        this.state = (this.corrections && this.corrections.length > 0) ? iqs.shell.States.Data : iqs.shell.States.Empty;
    }

    private sortCollection(data: iqs.shell.Correction[]): void {
        this.corrections = _.sortBy(data, function (item: iqs.shell.Correction) {
            return - moment(item.create_time).valueOf();
        });
    }

    private onRead(data: iqs.shell.Correction[], callback?: (data: iqs.shell.Correction[]) => void): void {
        let index: number;
        if (data && data.length > 0) {
            if (this.isSort) {
                this.sortCollection(data);
            } else {
                this.corrections = data;
            }
            index = _.findIndex(this.corrections, (item: iqs.shell.Correction) => {
                return item.id == this.$location.search()['correction_id'];
            });
            index = index > -1 ? index : 0;
        } else {
            this.corrections = [];
            index = -1;
        }

        this.selectItem(index);
        this.transaction.end();

        this.collectionChanged();
        if (callback) {
            callback(this.corrections);
        }

    }

    private getFilter(): any {
        if (!this._filter || !angular.isObject(this._filter)) {
            this._filter = {};
        }

        if (!this._filter.org_id && this.iqsOrganization.orgId) {
            this._filter.org_id = this.iqsOrganization.orgId
        }

        return this._filter;
    }

    // CRUD operation
    public read(successCallback?: (data: iqs.shell.Correction[]) => void, errorCallback?: (error: any) => void): angular.IPromise<any> {
        this.transaction.begin('READ_CORRECTION');
        return this.iqsCorrectionsData.readCorrections(this.getFilter(),
            (response: iqs.shell.DataPage<iqs.shell.Correction>) => {
                this.onRead(response.data, successCallback);
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Error: ' + JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public create(corrections: iqs.shell.Correction, successCallback?: (data: iqs.shell.Correction) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('CREATE_CORRECTION');
        this.iqsCorrectionsData.createCorrection(corrections,
            (data: iqs.shell.Correction) => {
                this.state = iqs.shell.States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Create resolution error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public delete(id: string, successCallback?: () => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('DELETE_CORRECTION');
        let index: number;
        if (this.selectedItem && this.selectedItem.id == id) {
            index = this.selectIndex < this.corrections.length - 1 ? this.selectIndex : this.selectIndex - 1;
        } else {
            index = this.selectIndex;
        }

        this.iqsCorrectionsData.deleteCorrection(id,
            () => {
                this.remove(id);
                if (successCallback) {
                    successCallback();
                }
                this.selectItem(index);
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Delete corrections error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    public update(id: string, corrections: iqs.shell.Correction, successCallback?: (data: iqs.shell.Correction) => void, errorCallback?: (error: any) => void): void {
        this.transaction.begin('UPDATE_CORRECTION');

        this.iqsCorrectionsData.updateCorrection(id, corrections,
            (data: iqs.shell.Correction) => {
                this.state = iqs.shell.States.Data;
                this.updateItemInCollection(data);
                if (successCallback) {
                    successCallback(data);
                }
                this.transaction.end();
            },
            (error: any) => {
                this.transaction.end(error);
                this.$log.error('Update corrections error: ', JSON.stringify(error));
                if (errorCallback) {
                    errorCallback(error);
                }
            }
        );
    }

    // property

    public set filter(value: any) {
        this._filter = value;
    }

    public get filter(): any {
        return this._filter;
    }

    public get isSort(): boolean {
        return this._isSort;
    }

    public set isSort(value: boolean) {
        if (!!value) {
            this._isSort = value;
        }
    }

    public get state(): string {
        return this._state;
    }

    public set state(value: string) {
        if (value) {
            this._state = value;
        }
    }

    // data operation
    public get(): iqs.shell.Correction[] {
        let result = _.cloneDeep(this.corrections);
        this.corrections = [];
        this.corrections = result;
        this.setState();

        return result;
    }

    public getSelectedIndex(): number {
        return this.selectIndex;
    }

    public getSelectedItem(): iqs.shell.Correction {
        return this.selectedItem;
    }

    public getTransaction(): pip.services.Transaction {
        return this.transaction;
    }

    public remove(id: string): void {
        _.remove(this.corrections, { id: id });
        this.selectItem();
        this.collectionChanged();
    }

    public reload(successCallback?: (data: iqs.shell.Correction[]) => void, errorCallback?: (error: any) => void) {
        this.corrections = new Array();
        this.state = iqs.shell.States.Progress;
        this.read(successCallback, errorCallback);
    }

    public selectItem(index?: number): void {
        if (index === undefined || index === null || index < 0 || index > this.corrections.length - 1) {
            if (this.$location.search()['correction_id']) {
                index = _.findIndex(this.corrections, (item: iqs.shell.Correction) => {
                    return item.id == this.$location.search()['correction_id'];
                });
            }
            if (!index || index == -1) {
                index = 0;
            }
        }

        this.selectIndex = index;

        this.selectedItem = (this.corrections && this.corrections.length > 0) ? this.corrections[index] : undefined;
        if (this.selectedItem) {
            this.$location.search('correction_id', this.selectedItem.id);
        }
    }

    public clean(): void {
        this.corrections = [];
        this.selectIndex = -1;
        this.selectedItem = null;
        this.state = iqs.shell.States.Empty;
    }
}