import { CorrectionEx } from './CorrectionEx';

class CorrectionRequestParams {
    public item: iqs.shell.Correction;
}

interface ICorrectionRequestDetailsPanelBindings {
    [key: string]: any;

    onCorrectionEdit: any;
    onCorrectionApproved: any;
    onCorrectionReject: any;
    item: any;
    ngDisabled: any;
}

const CorrectionRequestDetailsPanelBindings: ICorrectionRequestDetailsPanelBindings = {
    // change operational event
    onCorrectionEdit: '&iqsEdit',
    onCorrectionApproved: '&iqsApproved',
    onCorrectionReject: '&iqsReject',
    item: '<iqsItem',
    ngDisabled: '&?'
}

class CorrectionRequestDetailsPanelChanges implements ng.IOnChangesObject, ICorrectionRequestDetailsPanelBindings {
    [key: string]: ng.IChangesObject<any>;

    onCorrectionEdit: ng.IChangesObject<() => ng.IPromise<void>>;
    onCorrectionApproved: ng.IChangesObject<() => ng.IPromise<void>>;
    onCorrectionReject: ng.IChangesObject<() => ng.IPromise<void>>;
    item: ng.IChangesObject<iqs.shell.Correction>;
    ngDisabled: ng.IChangesObject<() => ng.IPromise<void>>;
}

class CorrectionRequestDetailsPanelController implements ng.IController {
    public $onInit() { }
    public item: iqs.shell.Correction = new iqs.shell.Correction();
    public onCorrectionEdit: (correctionRequest: CorrectionRequestParams) => void;
    public onCorrectionApproved: (correctionRequest: CorrectionRequestParams) => void;
    public onCorrectionReject: (correctionRequest: CorrectionRequestParams) => void;
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
        $element.addClass('iqs-correction-request-panel');
        if(this.iqsLoading.isDone) { this.prepare(); }
        this.cf.push($rootScope.$on(iqs.shell.LoadingCompleteEvent, () => { this.prepare(); }));
    }

    public $onDestroy() {
        for (const f of this.cf) { f(); }
    }

    public $onChanges(changes: CorrectionRequestDetailsPanelChanges): void {
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

    public onEdit(): void {
        if (this.onCorrectionEdit) {
            this.onCorrectionEdit({ item: this.item });
        }
    }

    public onApproved(): void {
        if (this.onCorrectionApproved) {
            this.onCorrectionApproved({ item: this.item });
        }
    }

    public onReject(): void {
        if (this.onCorrectionReject) {
            this.onCorrectionReject({ item: this.item });
        }
    }

}

(() => {
    angular
        .module('iqsCorrectionRequestDetailsPanel', [
            'iqsObjects.ViewModel',
            'iqsObjectGroups.ViewModel',
        ])
        .component('iqsCorrectionRequestDetailsPanel', {
            bindings: CorrectionRequestDetailsPanelBindings,
            templateUrl: 'manual_corrections/panels/CorrectionRequestDetailsPanel.html',
            controller: CorrectionRequestDetailsPanelController,
            controllerAs: '$ctrl'
        })
})();
