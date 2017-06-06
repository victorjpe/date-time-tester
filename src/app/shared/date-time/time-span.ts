export class TimeSpan {

	_millis: number;

	constructor(...args) {
		let days = 0;
		let hours = 0;
		let minutes = 0;
		let seconds = 0;
		let milliseconds = 0;

		switch (args.length) {
			case 0:
				break;
			case 1:
				milliseconds = args[0];
				break;
			case 2:
				days = args[0];
				hours = args[1];
				break;
			case 3:
				hours = args[0];
				minutes = args[1];
				seconds = args[2];
				break;
			case 4:
				days = args[0];
				hours = args[1];
				minutes = args[2];
				seconds = args[3];
				break;
			case 5:
				days = args[0];
				hours = args[1];
				minutes = args[2];
				seconds = args[3];
				milliseconds = args[4];
				break;
			default:
				throw ("No constructor of TimeSpan supports " + arguments.length + " arguments");
		}

		this._millis = (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;

	}

	add(timespan){
		return new TimeSpan(timespan._millis + this._millis);
	}
	
	compareTo(timespan){
		if(this._millis > timespan._millis) return 1;
		if(this._millis == timespan._millis) return 0;
		if(this._millis < timespan._millis) return -1;
	}
	
	duration(){
		return new TimeSpan(Math.abs(this._millis));
	}
	
	equals(timespan){
		return this._millis == timespan._millis;
	}
	
	negate(){ 
		this._millis *= -1; 
	}
	
	subtract(timespan){
		return new TimeSpan(this._millis - timespan._millis);
	}
	
	rounder(number){
		if(this._millis < 0)
			return Math.ceil(number);
		return Math.floor(number);
	}
	
	/* Properties */
	
	days(){ 
		return this.rounder(this._millis / (24 * 3600 * 1000) ); 
	}
	
	hours(){ 
		return this.rounder( (this._millis % (24 * 3600 * 1000)) / (3600 * 1000)); 
	}
	
	milliseconds(){ 
		return this.rounder(this._millis % 1000); 
	}
	
	minutes(){ 
		return this.rounder( (this._millis % (3600 * 1000)) / (60 * 1000)); 
	}
	
	seconds(){ 
		return this.rounder((this._millis % 60000) / 1000); 
	}
	
	totalDays(){ 
		return this._millis / (24 * 3600 * 1000); 
	}
	
	totalHours(){ 
		return this._millis / (3600 * 1000); 
	}
	
	totalMinutes(){ 
		return this._millis / (60 * 1000); 
	}
	
	totalSeconds(){ 
		return this._millis / 1000; 
	}
	
	totalMilliseconds(){ 
		return this._millis; 
	}
		
	toString(){
		return (this._millis < 0 ? "-" : "") + (Math.abs(this.days()) ? this.pad(Math.abs(this.days()))  + ".": "") + this.pad(Math.abs(this.hours())) + ":" + this.pad(Math.abs(this.minutes())) + ":" + this.pad(Math.abs(this.seconds())) + "." + Math.abs(this.milliseconds());
	}

	pad(number){
		return (number < 10 ? '0' : '') + number;
	}
}