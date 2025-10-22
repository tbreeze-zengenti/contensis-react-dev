---
sidebar_position: 1
---

# Filtering with Dates

When working with dates in search you can rely on Expression Functions in the Delivery API rather than handling dates within your application. 

Expression functions: https://www.contensis.com/help-and-docs/apis/delivery-http/search-basics/expression-functions

Time relative period: https://www.contensis.com/help-and-docs/apis/delivery-http/search-basics/relative-time-period

## Hide past events

This example demonstrates how to retrieve a list of upcoming events by applying a time-based filter. A `customWhere` query ensures that only events with a future date are returned.

```tsx
    events: {
      title: 'Upcoming Events',
      queryParams: {
        contentTypeIds: 'event',
        pageSize: 10,
        orderBy: ['date.from'],
        customWhere: [
          {
            field: 'date.from',
            greaterThan: 'now()',
          },
        ],
      },
    },
```

In the `event` content type, there is a Contensis date range field named `date`, which includes both a start (`date.from`) and an end date. The `customWhere` condition filters events by comparing the current datetime against the `date.from` value (the event's start date). Events are only included in the search results if their `date.from` is later than the current datetime.

When using expression functions like `now()`, the datetime is generated dynamically by the Delivery API at the time of the request. This approach is preferable to using JavaScript date objects within the search configuration, as JavaScript-based dates in this file are only calculated when the server starts, which can lead to outdated or incorrect filtering.

## Date-based filters

This example demonstrates how to define a series of date-based filters for various time periods.

```tsx
 date: {
    title: 'Date',
    fieldId: 'date.from',
    fieldOperator: 'between',
    isSingleSelect: true,
    items: [
      {
        title: 'This week',
        key: 'now()--now(+7d)',
      },
      {
        title: 'Next week',
        key: 'now(+7d)--now(+14d)',
      },
      {
        title: 'This month',
        key: 'now()--now(+31d)',
      },
      {
        title: 'Next month',
        key: 'now(+28d)--now(+62d)',
      },
      {
        title: 'Next 6 months',
        key: 'now()--now(+186d)',
      },
    ],
  },
```

In this filter, the `items` are manually defined, each specifying a date range using expression functions. The `now()` function accepts arguments to specify a time period either in the past or future, following the syntax outlined in the [search documentation](https://www.contensis.com/help-and-docs/apis/delivery-http/search-basics/relative-time-period#:~:text=to%20%22now(%2D1d)%22.-,Syntax,-The%20token%20consists). In this case, all arguments are in the future (`+`) and expressed in days (`d`).

Using this approach, we create a series of contextual filters that allow users to quickly retrieve content within a defined time period.

## Date range filtering (calendar)

This example demonstrates how to configure a date range filter that accepts two date values from the front end and filters results based on that specified range.

**Defining the Date Filter**

To begin, define the `date` filter in the configuration:

```tsx
date: {
    title: 'Date',
    fieldId: 'date.from',
    fieldOperator: 'between',
    isSingleSelect: true,
    items: [],
  },
```

Key aspects of this configuration:

- `fieldId`: Specifies the field to filter against.
- `fieldOperator`: Set to `'between'` to filter results within a date range.
- `isSingleSelect`: Ensures only one date range is applied at a time, preventing unpredictable results.
- `items`: Left empty since the date values will be provided dynamically by the front end.

**Implementing the Front-End Date Selection**

The following front-end logic captures the date range and applies the filter dynamically:

```tsx
const EventListingPage = () => {
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	
	useEffect(() => {
		if (startDate || endDate) {
      updateSelectedFilters(
        'date',
        `${startDate}T00:00:00.000Z--${endDate ? endDate: startDate}T23:59:59.999Z`,
        true
      );
    }	
	}, [startDate, endDate])
 
	return {
		<label htmlFor="start">Start date:</label>
		<input type="date" id="start" onChange={setStartDate(e.target.value)}/>
		
		<label htmlFor="start">End date:</label>
		<input type="date" id="start" onChange={setEndDate(e.target.value)}/>
	}
}
```

**State Management**:

- `startDate` and `endDate` are stored in component state.
- State updates via `onChange` event handlers when a user selects a date.

**Updating Filters**:

- A `useEffect` watches for changes to `startDate` or `endDate`.
- If either date changes, `updateSelectedFilters` is called to update the filter dynamically.

**Calling** `updateSelectedFilters`:

- `filter`: The key of the filter to update (`'date'`).
- `key`: The formatted date range in ISO format*
- `isUnknownItem`: Set to `true` to indicate the new filter item.

**Handling Single Date Selection***:

- If only `startDate` is selected, it is used as both the start and end date to ensure a valid range.

By wrapping `updateSelectedFilters` within `useEffect` and using state dependencies, the results update dynamically whenever the user selects or modifies a date.