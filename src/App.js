import { Calendar, momentLocalizer, toolbar } from "react-big-calendar";
import moment, { months } from "moment";

import axios from "axios";

import { useState } from "react";
import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";
import { addToHolidays } from "./slices/calenderSlice";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const countries = [
  { label: "Afghanistan", value: "AF" },
  { label: "Albania", value: "AL" },
  { label: "Pakistan", value: "PK" },
  { label: "Unite Stetes", value: "US" },
  { label: "United Kingdom", value: "GB" },
  { label: "India", value: "IN" },
];
const years = [
  { label: 2018, value: 2018 },
  { label: 2019, value: 2019 },
  { label: 2020, value: 2020 },
  { label: 2021, value: 2021 },
  { label: 2022, value: 2022 },
  { label: 2023, value: 2023 },
  { label: 2024, value: 2024 },
  { label: 2025, value: 2025 },
];

const monthsData = [
  { label: "Junary", value: 0 },
  { label: "Feburary", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

const App = () => {
  const CustomToolbar = (toolbar) => {
    const { label } = toolbar;
  };
  //// For Default year Selector
  const defaultMonthValue = 1;
  const defaultMonthOption = monthsData.find(
    (month) => month.value === defaultMonthValue
  );
  //// For Default year Selector
  const defaultYearValue = 2023;
  const defaultYearOption = years.find(
    (year) => year.value === defaultYearValue
  );
  //// For Default Country Select
  const defaultCountryValue = "US";
  const defaultCountriesOption = countries.find(
    (countries) => countries.value === defaultCountryValue
  );

  const [selectedCountry, setSelectedCountry] = useState(
    defaultCountriesOption
  );
  const [selectedMonth, setSelectedMonth] = useState(defaultMonthOption);

  const [selectedYear, setSelectedYear] = useState(defaultYearOption);
  const [year, setYear] = useState(new Date().getFullYear());
  const [date, setDate] = useState(new Date());
  const [apiErr, setApiErr] = useState(false);
  const dispatch = useDispatch();

  /// Select Events From Reduxs
  const events = useSelector((state) => state.calendarHolidays.holidays);

  /////Handlers
  /////Navigate Handler
  const handleNavigate = (date, view, action) => {
    let newDate;
    if (action === "NEXT") {
      // Increment the month when navigating to the next month
      newDate = moment(date).add(1, "month").toDate();
    } else if (action === "PREV") {
      // Decrement the month when navigating to the previous month
      newDate = moment(date).subtract(1, "month").toDate();
    }

    setDate(newDate);
  };
  //////Country change Handler
  const handleCountryChange = (selectedCountryOption) => {
    setSelectedCountry(selectedCountryOption);

    apiRequest(selectedCountryOption.value, year);
  };
  //// Year Change Handler
  const handleYearChange = (selectedYearOption) => {
    setSelectedYear(selectedYearOption);
    setYear(selectedYearOption.value);
    setDate(new Date(selectedYearOption.value, 0, 1));
    apiRequest(selectedCountry.value, selectedYearOption.value);
  };
  //// Month Change Handler
  const handleMonthChange = (selectedMonthOption) => {
    setSelectedMonth(selectedMonthOption);
    setDate(new Date(date.setMonth(selectedMonthOption.value)));
  };
  ////Api Request
  const apiRequest = async (country, year) => {
    let result = "";
    console.log(country, year);
    try {
      result = await axios.get(
        `https://calendarific.com/api/v2/holidays?&api_key=yh5uulYTaiIOuwp42m2ukRYjcemFMDnX&country=${country}&year=${year}`
      );
    } catch (err) {
      console.log(err);
      setApiErr(true);
    }
    ///Api Response Formating To send to Redux
    let holidays = result.data.response.holidays.map((holiday) => ({
      title: holiday.name,
      start: new Date(holiday.date.iso).toLocaleDateString(),
      end: new Date(holiday.date.iso).toLocaleDateString(),
    }));

    dispatch(addToHolidays(holidays));
  };

  return (
    <div className="container">
      {/* Selction Boxex */}
      <div className="select-country">
        <h4>Select Country : </h4>
        <Select
          className="country-select-box"
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countries}
        />
        <h4>Select Year :</h4>
        <Select
          className="year-select-box"
          value={selectedYear}
          onChange={handleYearChange}
          options={years}
        ></Select>
        <h4>Select Months : </h4>
        <Select
          className="country-select-box"
          value={selectedMonth}
          onChange={handleMonthChange}
          options={monthsData}
        />
      </div>

      {/* Calender */}

      {apiErr ? (
        <h3>Unable to make Request right now</h3>
      ) : (
        <h3>
          Event of {selectedCountry.label} of Year {year} Month{" "}
          {selectedMonth.label}
        </h3>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: "20px", height: "70vh" }}
        views={["month"]}
        date={date}
        onNavigate={() => handleNavigate()}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
};

export default App;
