/// <amd-dependency path="text!./stats-panel.html">

export var template = require("text!./stats-panel.html");
let ko : KnockoutStatic = require("knockout");

export class viewModel
{
    data: KnockoutObservable<any>;
    title: KnockoutObservable<string> = ko.observable<string>("Trip statistics!");
    topSpeedInMph: KnockoutObservable<number> = ko.observable<number>(0);
    averageSpeedInMph : KnockoutObservable<number> = ko.observable<number>(0);
    startDateTime: KnockoutObservable<Date> = ko.observable<Date>();
    endDateTime: KnockoutObservable<Date> = ko.observable<Date>();
    duration: KnockoutObservable<string> = ko.observable<string>();

    constructor(params)
    {
        this.data = params.data;
        this.data.subscribe( (newData) => {
            if(this.data() != null)
            {
                this.setData();
            }
        });
    }

    private setData = () =>
    {
        this.averageSpeedInMph(this.data().averageSpeed);
        this.startDateTime(this.data().startDateTime);
        this.endDateTime(this.data().endDateTime);
        this.topSpeedInMph(this.data().topSpeed);
        this.duration(this.data().duration);
    }

    dispose()
    {

    }
}
