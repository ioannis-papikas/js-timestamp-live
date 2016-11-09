var Timestamp = Timestamp || {};

(function ($) {
    Timestamp.Live = {
        literals: [],
        init: function () {
            // Set update timer for live timestamps, every 30 seconds
            window.setInterval(function () {
                Timestamp.Live.update(false);
            }, 30000);
        },
        loadLiterals: function (literals) {
            this.literals = literals;
        },
        update: function (init) {
            // Check if literals exist
            if (this.literals.length == 0) {
                return;
            }

            // Get current time for all timestamps
            var current_time = Math.round((new Date).getTime());
            current_time = Math.round(current_time / 1000);

            // Get every timestamp and update value according to format
            var literals = this.literals;
            $("data-timestamp-live").each(function () {
                // Get attributes
                var format = $(this).data("format");
                var unix_time = $(this).data("utime");

                // Get time difference
                var time_diff = current_time - unix_time;

                // Set timestamp
                var relative_timestamp = "";
                if (time_diff < 3) { // It's just now
                    relative_timestamp = literals["just_now"];
                } else if (time_diff < 60) { // It's seconds
                    relative_timestamp = (init ? time_diff + " " + literals["seconds_ago"] : literals["few_seconds_ago"]);
                } else if (time_diff < 60 * 60) { // It's minutes
                    var minutes = Math.floor(time_diff / 60);
                    relative_timestamp = (minutes == 1 ? literals["a_minute_ago"] : minutes + " " + literals["minutes_ago"]);
                } else if (time_diff < 24 * 60 * 60) { // It's hours
                    var hours = Math.floor(time_diff / (60 * 60));
                    relative_timestamp = (hours == 1 ? literals["an_hour_ago"] : hours + " " + literals["hours_ago"]);
                } else if (time_diff < 7 * 24 * 60 * 60) { // Days in a week
                    var uday = (new Date(unix_time * 1000)).getDay();
                    var cday = (new Date(current_time * 1000)).getDay();
                    var days = cday - uday;
                    days = (days <= 0 ? 7 + cday - uday : days);
                    relative_timestamp = (days == 1 ? literals["yesterday_at"] + " " + (new Date(unix_time * 1000)).format("H:i") : days + " " + literals["days_ago"]);
                } else {
                    relative_timestamp = (new Date(unix_time * 1000)).format(format);
                }

                // Set relative timestamp
                $(this).html(relative_timestamp);
            });
        },
        live: function (time, format) {
            // Create live timestamp
        },
        formatSeconds: function (seconds) {
            // Get whole minutes
            var minutes = Math.floor(seconds / 60);
            // Get remaining seconds
            seconds = seconds - minutes * 60;

            // Return formatted time
            return (minutes ? minutes + "m" : "") + " " + seconds + "s";
        }
    }
})(jQuery);
