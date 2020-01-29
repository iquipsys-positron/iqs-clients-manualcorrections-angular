import { CorrectionEx } from './CorrectionEx';

class CorrectionHistoryDetailsParams {
    public item: iqs.shell.Correction;
}

interface ICorrectionHistoryDetailsPanelBindings {
    [key: string]: any;

    onCorrectionlDelete: any;
    item: any;
    ngDisabled: any;
}

const CorrectionHistoryDetailsPanelBindings: ICorrectionHistoryDetailsPanelBindings = {
    onCorrectionlDelete: '&iqsDelete',
    item: '<iqsItem',
    ngDisabled: '&?'
}

class CorrectionHistoryDetailsPanelChanges implements ng.IOnChangesObject, ICorrectionHistoryDetailsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onCorrectionlDelete: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<iqs.shell.Correction>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class CorrectionHistoryDetailsPanelController implements ng.IController {
    public $onInit() { }
    public item: iqs.shell.Correction = new iqs.shell.Correction();
    public onCorrectionlDelete: (correctionRequest: CorrectionHistoryDetailsParams) => void;
    public ngDisabled: () => boolean;

    public collectionEx: CorrectionEx[];
    public expandedId: string = null;
    private cf: Function[] = [];

    constructor(
        $rootScope: ng.IRootScopeService,
        private $element: JQuery,
        private $state: ng.ui.IStateService,
        private iqsObjectsViewModel: iqs.shell.IObjectsViewModel,
        private iqsObjectGroupsViewModel: iqs.shell.IObjectGroupsViewModel,
        public pipMedia: pip.layouts.IMediaService,
        private iqsLoading: iqs.shell.ILoadingService,
    ) {
        $element.addClass('iqs-сorrection-history-panel');
        if(this.iqsLoading.isDone) { this.prepare(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.prepare(); }));

        // this.iqsObjectsViewModel.read();
        // this.iqsObjectGroupsViewModel.read();
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: CorrectionHistoryDetailsPanelChanges): void {
        this.prepare();
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
        this.setReferenceObject(this.item);
    }

    public onDelete(): void {
        if (this.onCorrectionlDelete) {
            this.onCorrectionlDelete({ item: this.item });
        }
    }
}

(() => {
    angular
        .module('iqsCorrectionHistoryDetailsPanel', [
            'iqsObjects.ViewModel',
            'iqsObjectGroups.ViewModel',
        ])
        .component('iqsCorrectionHistoryDetailsPanel', {
            bindings: CorrectionHistoryDetailsPanelBindings,
            templateUrl: 'manual_corrections/panels/CorrectionHistoryDetailsPanel.html',
            controller: CorrectionHistoryDetailsPanelController,
            controllerAs: '$ctrl'
        })
})();
