import { TimeSpan } from './time-span';

export class DateTime {

	span: TimeSpan;

	constructor(...args) {
		let year = 0;
		let month = 0;
		let day = 0;
		let hour = 0;
		let minute = 0;
		let second = 0;
		let millisecond = 0;
		let days = 0;

		switch (args.length) {
			case 0:
				var d = new Date();
				year = d.getFullYear();
				month = d.getMonth() + 1;
				day = d.getDay();
				hour = d.getHours();
				minute = d.getMinutes();
				second = d.getSeconds();
				millisecond = d.getMilliseconds();
				break;
			case 1:
				millisecond = args[0];
				break;
			case 3:
				year = args[0];
				month = args[1];
				day = args[2];
				break;
			case 6:
				year = args[0];
				month = args[1];
				day = args[2];
				hour = args[3];
				minute = args[4];
				second = args[5];
				break;
			case 7:
				year = args[0];
				month = args[1];
				day = args[2];
				hour = args[3];
				minute = args[4];
				second = args[5];
				millisecond = args[6];
				break;
			default:
				throw ("No constructor supports " + args.length + " arguments");
		}

		if (!year && !month && !day)
			days = 0;
		else
			days = Math.round(this.absoluteDays(year, month, day));

		this.span = new TimeSpan(days, hour, minute, second, millisecond);
	}

	toString() {
		return this.year() + "/" + this.span.pad(this.month()) + "/" + this.span.pad(this.day()) + " " + this.timeOfDay();
	}

	/* Methods */
	absoluteDays(year, month, day) {

		function div(a, b) { return Math.round(a / b); }
		var num = 0;
		var num2 = 1;
		var numArray = !this.isLeapYear(year) ? this.monthDays : this.monthDaysLeapYear;
		while (num2 < month) {
			num += numArray[num2++];
		}
		return ((((((day - 1) + num) + (365 * (year - 1))) + ((year - 1) / 4)) - ((year - 1) / 100)) + ((year - 1) / 400)); s
	}

	add(timespan) {
		return new DateTime(this.span._millis + timespan._millis);
	}

	addDays(days) {
		return new DateTime(this.span._millis + days * 86400000);
	}

	addHours(hours) {
		return new DateTime(this.span._millis + hours * 3600000);
	}

	addMilliseconds(millis) {
		return new DateTime(this.span._millis + millis);
	}

	addMinutes(minutes) {
		return new DateTime(this.span._millis + minutes * 60000);
	}

	addMonths(months) {
		let day = this.day();
		let month = this.month() + (months % 12);
		let year = this.year() + Math.round(months / 12);

		if (month < 1) {
			month = 12 + month;
		} else if (month > 12) {
			month -= 12;
			year++;
		}

		let days = this.daysInMonth(year, month);

		if (day > days)
			day = days;

		let time = new DateTime(year, month, day);
		return time.add(this.timeOfDay());
	}

	addSeconds(seconds) {
		return new DateTime(this.span._millis + seconds * 1000);
	}

	addYears(years) {
		return this.addMonths(years * 12);
	}

	compareTo(datetime) {
		return this.span.compareTo(datetime.span);
	}

	equals(datetime) {
		return this.span.equals(datetime.span);
	}

	subtractDate(datetime) {
		return new TimeSpan(this.span._millis - datetime.span._millis);
	}

	subtractTime(timespan) {
		return new DateTime(this.span._millis - timespan._millis);
	}

	fromSpan(what) {

		let index = 1;
		let daysmonth = this.monthDays;
		let days = this.span.days();
		let num = Math.round(days / 146097);
		days -= num * 146097;
		let num2 = Math.round(days / 36524);
		if (num2 == 4) num2 = 3;
		days -= num2 * 36524;
		let num3 = Math.round(days / 1461);
		days -= num3 * 1461;
		let num4 = Math.round(days / 365);
		if (num4 == 4) num = 3;
		if (what == "year")
			return (((((num * 400) + (num2 * 100)) + (num3 * 4)) + num4) + 1);
		days -= num4 * 365;
		if (what != "dayyear") {
			if ((num4 == 3) && ((num2 == 3) || (num3 != 24)))
				daysmonth = this.monthDaysLeapYear;
			while (days >= daysmonth[index])
				days -= daysmonth[index++];
			if (what == "month")
				return index;
		}
		return days + 1;

	}


	format(format) {
		var shortdays = new Array("", this.strings.Mon, this.strings.Tue, this.strings.Wed, this.strings.Thu, this.strings.Fri, this.strings.Sat, this.strings.Sun);
		var days = new Array("", this.strings.Monday, this.strings.Tuesday, this.strings.Wednesday, this.strings.Thursday, this.strings.Friday, this.strings.Saturday, this.strings.Sunday);
		var shortmonths = new Array("", this.strings.Jan, this.strings.Feb, this.strings.Mar, this.strings.Apr, this.strings.May, this.strings.Jun, this.strings.Jul, this.strings.Aug, this.strings.Sep, this.strings.Oct, this.strings.Nov, this.strings.Dec);
		var months = new Array("", this.strings.January, this.strings.February, this.strings.March, this.strings.April, this.strings.MayFull, this.strings.June, this.strings.July, this.strings.August, this.strings.September, this.strings.October, this.strings.November, this.strings.December);

		var day = this.day();
		var dayOfWeek = this.dayOfWeek();
		var millisecond = this.millisecond();
		var hour = this.hour();
		var minute = this.minute();
		var second = this.second();
		var month = this.month();
		var year = this.year();

		var data = new Array();

		var yearstr = year + "";
		/*
		if(yearstr.length > 1)
			yearstr = yearstr.substr(0, yearstr.length - 2)
		*/
		data["dddd"] = days[dayOfWeek];
		data["ddd"] = shortdays[dayOfWeek];
		data["dd"] = this.span.pad(day);
		data["d"] = day;
		data["fff"] = millisecond;
		data["ff"] = Math.round(millisecond / 10);
		data["f"] = Math.round(millisecond / 100);
		data["hh"] = this.span.pad(hour > 12 ? hour - 12 : hour);
		data["h"] = hour > 12 ? hour - 12 : hour;
		data["HH"] = this.span.pad(hour);
		data["H"] = hour;
		data["mm"] = this.span.pad(minute);
		data["m"] = minute;
		data["MMMM"] = months[month];
		data["MMM"] = shortmonths[month];
		data["MM"] = this.span.pad(month);
		data["M"] = month;
		data["ss"] = this.span.pad(second);
		data["s"] = second;
		data["tt"] = (hour > 12 ? this.strings.PM : this.strings.AM);
		data["t"] = (hour > 12 ? this.strings.P : this.strings.A);
		data["yyyy"] = year;
		data["yyy"] = year;
		data["yy"] = year;
		data["y"] = year;
		data[":"] = this.strings.TimeSeparator;
		data["/"] = this.strings.DateSeparator;


		var output = "";
		var res = format.split(/(dddd|ddd|dd|d|fff|ff|f|hh|h|HH|H||mm|m|MMMM|MMM|MM|M|ss|s|tt|t|yyyy|yyy|yy|y)?/);

		for (var i = 0; i < res.length; i++) {
			if (res[i]) {
				if (data[res[i]]) {
					output += data[res[i]];
				} else {
					output += res[i];
				}
			}
		}

		return output;
	}

	/* Properties */
	date() {
		return new DateTime(this.year(), this.month(), this.day());
	}

	day() {
		return this.fromSpan("day");
	}

	dayOfWeek() {
		return (this.span.days() + 1) % 7;
	}

	dayOfYear() {
		return this.fromSpan("dayyear");
	}

	hour() {
		return this.span.hours();
	}

	millisecond() {
		return this.span.milliseconds();
	}

	minute() {
		return this.span.minutes();
	}

	month() {
		return this.fromSpan("month");
	}

	second() {
		return this.span.seconds();
	}

	timeOfDay() {
		return new TimeSpan(this.span._millis % 86400000);
	}

	year() {
		return this.fromSpan("year");
	}

	monthDays: Array<number> = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
	monthDaysLeapYear: Array<number> = new Array(0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

	daysInMonth(year, month) {
		if (this.isLeapYear(year)) {
			return this.monthDaysLeapYear[month];
		} else {
			return this.monthDays[month];
		}
	};

	now() {
		let d = new Date();
		return new DateTime(d.getFullYear(), d.getMonth() + 1, d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
	};
	utcNow() {
		let d = new Date();
		return new DateTime(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDay(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(), d.getUTCMilliseconds());
	};
	today() {
		let now = this.now();
		return new DateTime(now.year(), now.month(), now.day());
	};
	isLeapYear(year) {
		if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0))
			return true;
		return false;
	};

	strings: any = {
		Mon: "Mon",
		Monday: "Monday",
		Tue: "Tue",
		Tuesday: "Tuesday",
		Wed: "Wed",
		Wednesday: "Wednesday",
		Thu: "Thu",
		Thursday: "Thursday",
		Fri: "Fri",
		Friday: "Friday",
		Sat: "Sat",
		Saturday: "Saturday",
		Sun: "Sun",
		Sunday: "Sunday",
		Jan: "Jan",
		Januray: "January",
		Feb: "Feb",
		February: "February",
		Mar: "Mar",
		March: "March",
		Apr: "Apr",
		April: "April",
		May: "May",
		MayFull: "May",
		Jun: "Jun",
		June: "June",
		Jul: "Jul",
		July: "July",
		Aug: "Aug",
		August: "August",
		Sep: "Sep",
		September: "September",
		Oct: "Oct",
		October: "October",
		Nov: "Nov",
		November: "November",
		Dec: "Dec",
		December: "December",
		A: "A",
		AM: "AM",
		P: "P",
		PM: "PM",
		TimeSeparator: ":",
		DateSeparator: "/"
	};
}