class CorrectionParams {
    public item: iqs.shell.Correction;
}

interface ICorrectionEditPanelBindings {
    [key: string]: any;

    onCorrectionlSave: any;
    onCorrectionlCancel: any;
    newItem: any;
    editItem: any;
    ngDisabled: any;
}

const CorrectionEditPanelBindings: ICorrectionEditPanelBindings = {
    onCorrectionlSave: '&iqsSave',
    onCorrectionlCancel: '&iqsCancel',
    newItem: '=?iqsNewItem',
    editItem: '=?iqsEditItem',
    ngDisabled: '&?'
}

class CorrectionEditPanelChanges implements ng.IOnChangesObject, ICorrectionEditPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onCorrectionlSave: ng.IChangesObject<() => ng.IPromise<void>>;
    onCorrectionlCancel: ng.IChangesObject<() => ng.IPromise<void>>;
    newItem: ng.IChangesObject<iqs.shell.Correction>;
    editItem: ng.IChangesObject<iqs.shell.Correction>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class ParamsItem {
    id: string;
    value: number;
}

class CorrectionEditPanelController implements ng.IController {
    public $onInit() { }
    public correction: iqs.shell.Correction;

    public form: any;
    public touchedErrorsWithHint: Function;
    public error: string = '';

    public newItem: iqs.shell.Correction;
    public editItem: iqs.shell.Correction;
    public onCorrectionlSave: (correctionEdit: CorrectionParams) => void;
    public onCorrectionlCancel: () => void;
    public ngDisabled: () => boolean;

    public correctionModelCollection: iqs.shell.TypeCollection;

    public objectsGroups: iqs.shell.MultiSelectDialogData[];
    public zones: iqs.shell.Zone[];
    public rules: iqs.shell.EventRule[];
    public correctionParametrs: iqs.shell.TypeCollection;
    public correctionParametrsMeasure: iqs.shell.TypeCollection;

    public correctionEntityId: string;
    public paramName: string;
    public ruleId: string;
    public zoneId: string;

    public paramsCollection: ParamsItem[];
    public eventParamCollection: ParamsItem[];
    public zoneParamCollection: ParamsItem[];

    public isQuery: boolean = false;
    public maxDate: Date;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $scope: ng.IScope,
        private $state: ng.ui.IStateService,
        private iqsTypeCollectionsService: iqs.shell.ITypeCollectionsService,
        private pipFormErrors: pip.errors.IFormErrorsService,
        public pipMedia: pip.layouts.IMediaService,
        // private iqsCorrectionsViewModel: ICorrectionsViewModel,
        private iqsEventRulesViewModel: iqs.shell.IEventRulesViewModel,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsZonesViewModel: iqs.shell.IZonesViewModel,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        $element.addClass('iqs-correction-edit-panel layout-column flex');

        this.touchedErrorsWithHint = pipFormErrors.touchedErrorsWithHint;
        this.correctionParametrs = this.iqsTypeCollectionsService.getCorrectionParametrs();
        this.correctionParametrsMeasure = this.iqsTypeCollectionsService.getCorrectionParametrsMeasure();
        if(this.iqsLoading.isDone) { this.init(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.init(); }));

        this.maxDate = new Date();
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private updateTypeCollection() {

    }

    public $onChanges(changes: CorrectionEditPanelChanges): void {
        let change: boolean = false;

        if (changes.newItem) {
            if (!_.isEqual(this.newItem, changes.newItem.previousValue)) {
                this.init();

                return;
            }
        }

        if (changes.editItem) {
            if (!_.isEqual(this.editItem, changes.editItem.previousValue)) {
                this.init();

                return;
            }
        }

        this.init();
    }

    public $postLink() {
        this.form = this.$scope.form;
    }

    private addEmptyParams() {
        this.paramsCollection.push({ id: null, value: 0 });
        this.eventParamCollection.push({ id: null, value: 0 });
        this.zoneParamCollection.push({ id: null, value: 0 });
    }

    private splitParams(changes?: iqs.shell.CorrectionChange[]) {
        this.paramsCollection = [];
        this.eventParamCollection = [];
        this.zoneParamCollection = [];

        _.each(changes, (change: iqs.shell.CorrectionChange) => {
            if (change.param_name) {
                this.paramsCollection.push({ id: change.param_name, value: change.value });
            } else if (change.event_rule_id) {
                this.eventParamCollection.push({ id: change.event_rule_id, value: change.value });
            } else if (change.zone_id) {
                this.zoneParamCollection.push({ id: change.zone_id, value: change.value });
            }
        });

        this.addEmptyParams();
    }

    private combineParams(): iqs.shell.CorrectionChange[] {
        let result: iqs.shell.CorrectionChange[] = [];
        _.each(this.paramsCollection, (item: ParamsItem) => {
            if (item.id) {
                result.push({ param_name: item.id, value: item.value });
            }
        });
        _.each(this.eventParamCollection, (item: ParamsItem) => {
            if (item.id) {
                result.push({ event_rule_id: item.id, value: item.value });
            }
        });
        _.each(this.zoneParamCollection, (item: ParamsItem) => {
            if (item.id) {
                result.push({ zone_id: item.id, value: item.value });
            }
        });

        return result;
    }

    private init() {
        this.form = this.$scope.form;

        if (this.editItem) {
            this.correction = _.cloneDeep(this.editItem);
            this.correctionEntityId = this.editItem.object_id ? this.editItem.object_id : this.editItem.group_id;
        } else {
            this.correction = _.cloneDeep(this.newItem) || <iqs.shell.Correction>{};
            this.correction.time = new Date();
        }

        this.splitParams(this.correction.changes);
        this.prepare();
    }

    private getCollection(collection: any[], type?: string): iqs.shell.MultiSelectDialogData[] {
        let result: iqs.shell.MultiSelectDialogData[] = [];

        _.each(collection, (item: any) => {

            let obj: iqs.shell.MultiSelectDialogData = {
                id: item.id,
                name: item.name,
                object_type: type
            };
            result.push(obj);
        });

        return result;
    }

    private prepare() {
        if (!this.iqsLoading.isDone) return;
        let objects: iqs.shell.MultiSelectDialogData[];
        let groups: iqs.shell.MultiSelectDialogData[];

        objects = this.getCollection(this.iqsObjectsViewModel.allObjects, iqs.shell.SearchObjectTypes.ControlObject);
        groups = this.getCollection(this.iqsObjectGroupsViewModel.getCollection(
            () => {
                this.prepare();
            }
        ), iqs.shell.SearchObjectTypes.ObjectGroup);
        this.objectsGroups = _.unionBy(objects, groups, 'id');

        this.zones = this.iqsZonesViewModel.zones;
        this.rules = this.iqsEventRulesViewModel.getCollection();
    }

    public onSaveClick(): void {
        // if (this.form.$invalid) {
        //     this.pipFormErrors.resetFormErrors(this.form, true);

        //     return;
        // }

        // set object_id or group_id from correctionEntityId

        // combine params
        let ref: iqs.shell.MultiSelectDialogData = _.find(this.objectsGroups, (item: iqs.shell.MultiSelectDialogData) => {
            return item.id == this.correctionEntityId;
        });

        if (ref && ref.id) {
            if (ref.object_type == iqs.shell.SearchObjectTypes.ControlObject) {
                this.correction.object_id = ref.id;
            } else if (ref.object_type == iqs.shell.SearchObjectTypes.ObjectGroup) {
                this.correction.group_id = ref.id;
            } else {
                // error
                return
            }
        } else {
            // error
            return;
        }
        this.correction.changes = this.combineParams();

        if (this.onCorrectionlSave) {
            // this.pipFormErrors.resetFormErrors(this.form, false);
            this.onCorrectionlSave({ item: this.correction });
        }
    }

    public onCancelClick(): void {
        if (this.onCorrectionlCancel) {
            this.onCorrectionlCancel();
        }
    }

    public onChangeParams(index: number): void {
        if (index == this.paramsCollection.length - 1 && this.paramsCollection[index].id &&
            this.paramsCollection[index].value !== undefined && this.paramsCollection[index].value !== null) {
            this.paramsCollection.push({ id: null, value: 0 });
        }

        this.error = '';
    }

    public onChangeEventRule(index: number): void {
        if (index == this.eventParamCollection.length - 1 && this.eventParamCollection[index].id &&
            this.eventParamCollection[index].value !== undefined && this.eventParamCollection[index].value !== null) {
            this.eventParamCollection.push({ id: null, value: 0 });
        }
    }

    public onChangeZone(index: number): void {
        if (index == this.zoneParamCollection.length - 1 && this.zoneParamCollection[index].id &&
            this.zoneParamCollection[index].value !== undefined && this.zoneParamCollection[index].value !== null) {
            this.zoneParamCollection.push({ id: null, value: 0 });
        }
    }

    public onAddParams() {
        this.paramsCollection.push({ id: null, value: 0 });
    }

    public onAddEventRuleParams() {
        this.eventParamCollection.push({ id: null, value: 0 });
    }

    public onAddZoneParams() {
        this.zoneParamCollection.push({ id: null, value: 0 });
    }

    public onDeleteParams(index: number) {
        if (index > -1 && this.paramsCollection.length > index) {
            this.paramsCollection.splice(index, 1);
        }
    }

    public onDeleteEventRuleParams(index: number) {
        if (index > -1 && this.eventParamCollection.length > index) {
            this.eventParamCollection.splice(index, 1);
        }
    }

    public onDeleteZoneParams(index: number) {
        if (index > -1 && this.zoneParamCollection.length > index) {
            this.zoneParamCollection.splice(index, 1);
        }
    }
}

(() => {
    angular
        .module('iqsCorrectionEditPanel', [])
        .component('iqsCorrectionEditPanel', {
            bindings: CorrectionEditPanelBindings,
            templateUrl: 'manual_corrections/panels/CorrectionEditPanel.html',
            controller: CorrectionEditPanelController,
            controllerAs: '$ctrl'
        })
})();
