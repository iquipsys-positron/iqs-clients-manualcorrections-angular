import { CorrectionEx } from './CorrectionEx';

class CorrectionHistoryParams {
    public item: iqs.shell.Correction;
}

interface ICorrectionHistoryListPanelBindings {
    [key: string]: any;

    selectCorrection: any;
    collection: any;
    ngDisabled: any;
}

const CorrectionHistoryListPanelBindings: ICorrectionHistoryListPanelBindings = {
    selectCorrection: '&iqsSelect',
    collection: '<iqsCollection',
    ngDisabled: '&?'
}

class CorrectionHistoryListPanelChanges implements ng.IOnChangesObject, ICorrectionHistoryListPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    selectCorrection: ng.IChangesObject<() => ng.IPromise<void>>;
    collection: ng.IChangesObject<iqs.shell.Correction[]>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class CorrectionHistoryListPanelController implements ng.IController {
    public $onInit() { }
    public collection: iqs.shell.Correction[];
    public selectCorrection: (correctionRequest: any) => void;
    public ngDisabled: () => boolean;

    public selectedIndex: number = 0;

    public collectionEx: CorrectionEx[];
    public expandedId: string = null;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private $location: ng.ILocationService,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        public pipMedia: pip.layouts.IMediaService,
        private $scope: ng.IScope,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        $element.addClass('iqs-сorrection-history-panel');
        if(this.iqsLoading.isDone) { this.initializeItem(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.initializeItem(); }));

        // this.iqsObjectsViewModel.read();
        // this.iqsObjectGroupsViewModel.read();

        // this.initializeItem();
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    private initializeItem() {
        if (!this.iqsLoading.isDone) return;
        setTimeout(() => {
            this.selectedIndex = Math.max(0,
                _.findIndex(this.collection, (item) => {
                    return this.$location.search()['correction_id'] == item.id;
                })
            );

            this.selectItem(this.selectedIndex);
        }, 0);
    }


    public $onChanges(changes: CorrectionHistoryListPanelChanges): void {
        this.prepare();
        this.initializeItem();
    }

    private setReferenceObject(c: CorrectionEx): void {
        if (c.object_id) {
            let object: iqs.shell.ControlObject = this.iqsObjectsViewModel.getObjectById(c.object_id);
            if (object) {
                c.ref_id = object.id;
                c.ref_name = object.name;

                return;
            }
        }
        if (c.group_id) {
            let group: iqs.shell.ObjectGroup = this.iqsObjectGroupsViewModel.getGroupById(c.group_id);
            if (group) {
                c.ref_id = group.id;
                c.ref_name = group.name;

                return;
            }
        }
    }

    public prepare(): void {
        if (!this.iqsLoading.isDone) return;
        let collectionEx: CorrectionEx[] = [];

        _.each(this.collection, (item: iqs.shell.Correction) => {
            let correction: CorrectionEx = _.cloneDeep(item);
            this.setReferenceObject(correction);

            collectionEx.push(correction);
        });

        this.collectionEx = collectionEx;
    }

    public selectItem(index) {
        this.$location.search('correction_id', this.collection[index].id);
        if (this.selectCorrection) {
            this.selectCorrection({ item: this.collection[index] });
        }
    }
}

(() => {
    angular
        .module('iqsCorrectionHistoryListPanel', [
            'iqsObjects.ViewModel',
            'iqsObjectGroups.ViewModel',
        ])
        .component('iqsCorrectionHistoryListPanel', {
            bindings: CorrectionHistoryListPanelBindings,
            templateUrl: 'manual_corrections/panels/CorrectionHistoryListPanel.html',
            controller: CorrectionHistoryListPanelController,
            controllerAs: '$ctrl'
        })
})();
