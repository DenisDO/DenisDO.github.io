const app = angular.module('currencyApp', []);

app.value('baseURL', 'https://free.currencyconverterapi.com/api/v6/');
app.value('APIkey', '4483a148b31992545c54');
app.value('feePercantage', [0, 2, 5, 10]);
app.value('defaultFrom', 'EUR');
app.value('defaultTo', 'UAH');
app.value('defaultPercantage', 0);

app.service('APIservice', ['$http', 'baseURL', 'APIkey', function($http, baseURL, APIkey) {
  this.getListOfCurrencies = () => {
    const listOfCurrencies = [];

    $http({
      method: 'GET',
      url: `${baseURL}currencies?apiKey=${APIkey}`
    }).then(({data}) => {
        const currencues = data.results;
        
        for (const key in currencues) {
          listOfCurrencies.push(currencues[key].id);
        };
    });

    return listOfCurrencies;
  }

  this.getRate = (curFrom, curTo) => {
    return $http({
      method: 'GET',
      url: `${baseURL}convert?apiKey=${APIkey}&q=${curFrom}_${curTo}&compact=ultra`
    }).then(({data}) => {
      const [key] = Object.keys(data);
      return data[key];
    });
  }
  
  this.calcExchangeValue = (value, rate, percentage) => {
    return (value * rate) - (value * rate) / 100 * percentage;
  };
}]);

app.filter('excludeFrom', [function() {
  return function(array, expression) {
    return array.filter(function(item) {
        return !expression || !angular.equals(item,expression);
    });
  };
}]);
  
app.controller('CurrencyController', [
    '$scope',
    'APIservice',
    'feePercantage',
    'defaultFrom',
    'defaultTo',
    'defaultPercantage',
    function($scope, APIservice, feePercantage, defaultFrom, defaultTo, defaultPercantage) {

    this.listOfCurrencies = APIservice.getListOfCurrencies();
    this.defaultFrom = defaultFrom;
    this.defaultTo = defaultTo;
    this.feePercantage = feePercantage;
    this.defaultPercantage = defaultPercantage;

    $scope.$watchGroup(['curCont.defaultFrom', 'curCont.defaultTo'], () => {
        this.updateData();
    });

    $scope.$watchGroup(['curCont.inputToExchange', 'curCont.defaultPercantage'], () => {
        this.toExchange();
    });

    this.toExchange = () => {
        const exchangeValue = APIservice.calcExchangeValue(this.inputToExchange, this.rate, this.defaultPercantage);
        this.inputToGet = +exchangeValue.toFixed(2);
    };

    this.revertExchange = () => {
        [this.defaultFrom, this.defaultTo] = [this.defaultTo, this.defaultFrom];
        [this.inputToExchange, this.inputToGet] = [this.inputToGet, this.inputToExchange];
        this.updateData();
    };

    this.updateData = () => {
        APIservice.getRate(this.defaultFrom, this.defaultTo)
            .then(data => {
                this.rate = data;
                this.toExchange();
            });
    };
}]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiLCJzZXJ2aWNlcy5qcyIsImZpbHRlcnMuanMiLCJjb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnY3VycmVuY3lBcHAnLCBbXSk7XHJcbiIsImFwcC52YWx1ZSgnYmFzZVVSTCcsICdodHRwczovL2ZyZWUuY3VycmVuY3ljb252ZXJ0ZXJhcGkuY29tL2FwaS92Ni8nKTtcbmFwcC52YWx1ZSgnQVBJa2V5JywgJzQ0ODNhMTQ4YjMxOTkyNTQ1YzU0Jyk7XG5hcHAudmFsdWUoJ2ZlZVBlcmNhbnRhZ2UnLCBbMCwgMiwgNSwgMTBdKTtcbmFwcC52YWx1ZSgnZGVmYXVsdEZyb20nLCAnRVVSJyk7XG5hcHAudmFsdWUoJ2RlZmF1bHRUbycsICdVQUgnKTtcbmFwcC52YWx1ZSgnZGVmYXVsdFBlcmNhbnRhZ2UnLCAwKTtcblxuYXBwLnNlcnZpY2UoJ0FQSXNlcnZpY2UnLCBbJyRodHRwJywgJ2Jhc2VVUkwnLCAnQVBJa2V5JywgZnVuY3Rpb24oJGh0dHAsIGJhc2VVUkwsIEFQSWtleSkge1xuICB0aGlzLmdldExpc3RPZkN1cnJlbmNpZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgbGlzdE9mQ3VycmVuY2llcyA9IFtdO1xuXG4gICAgJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogYCR7YmFzZVVSTH1jdXJyZW5jaWVzP2FwaUtleT0ke0FQSWtleX1gXG4gICAgfSkudGhlbigoe2RhdGF9KSA9PiB7XG4gICAgICAgIGNvbnN0IGN1cnJlbmN1ZXMgPSBkYXRhLnJlc3VsdHM7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjdXJyZW5jdWVzKSB7XG4gICAgICAgICAgbGlzdE9mQ3VycmVuY2llcy5wdXNoKGN1cnJlbmN1ZXNba2V5XS5pZCk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbGlzdE9mQ3VycmVuY2llcztcbiAgfVxuXG4gIHRoaXMuZ2V0UmF0ZSA9IChjdXJGcm9tLCBjdXJUbykgPT4ge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiBgJHtiYXNlVVJMfWNvbnZlcnQ/YXBpS2V5PSR7QVBJa2V5fSZxPSR7Y3VyRnJvbX1fJHtjdXJUb30mY29tcGFjdD11bHRyYWBcbiAgICB9KS50aGVuKCh7ZGF0YX0pID0+IHtcbiAgICAgIGNvbnN0IFtrZXldID0gT2JqZWN0LmtleXMoZGF0YSk7XG4gICAgICByZXR1cm4gZGF0YVtrZXldO1xuICAgIH0pO1xuICB9XG4gIFxuICB0aGlzLmNhbGNFeGNoYW5nZVZhbHVlID0gKHZhbHVlLCByYXRlLCBwZXJjZW50YWdlKSA9PiB7XG4gICAgcmV0dXJuICh2YWx1ZSAqIHJhdGUpIC0gKHZhbHVlICogcmF0ZSkgLyAxMDAgKiBwZXJjZW50YWdlO1xuICB9O1xufV0pO1xuIiwiYXBwLmZpbHRlcignZXhjbHVkZUZyb20nLCBbZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcnJheSwgZXhwcmVzc2lvbikge1xuICAgIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gIWV4cHJlc3Npb24gfHwgIWFuZ3VsYXIuZXF1YWxzKGl0ZW0sZXhwcmVzc2lvbik7XG4gICAgfSk7XG4gIH07XG59XSk7XG4gICIsImFwcC5jb250cm9sbGVyKCdDdXJyZW5jeUNvbnRyb2xsZXInLCBbXG4gICAgJyRzY29wZScsXG4gICAgJ0FQSXNlcnZpY2UnLFxuICAgICdmZWVQZXJjYW50YWdlJyxcbiAgICAnZGVmYXVsdEZyb20nLFxuICAgICdkZWZhdWx0VG8nLFxuICAgICdkZWZhdWx0UGVyY2FudGFnZScsXG4gICAgZnVuY3Rpb24oJHNjb3BlLCBBUElzZXJ2aWNlLCBmZWVQZXJjYW50YWdlLCBkZWZhdWx0RnJvbSwgZGVmYXVsdFRvLCBkZWZhdWx0UGVyY2FudGFnZSkge1xuXG4gICAgdGhpcy5saXN0T2ZDdXJyZW5jaWVzID0gQVBJc2VydmljZS5nZXRMaXN0T2ZDdXJyZW5jaWVzKCk7XG4gICAgdGhpcy5kZWZhdWx0RnJvbSA9IGRlZmF1bHRGcm9tO1xuICAgIHRoaXMuZGVmYXVsdFRvID0gZGVmYXVsdFRvO1xuICAgIHRoaXMuZmVlUGVyY2FudGFnZSA9IGZlZVBlcmNhbnRhZ2U7XG4gICAgdGhpcy5kZWZhdWx0UGVyY2FudGFnZSA9IGRlZmF1bHRQZXJjYW50YWdlO1xuXG4gICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnY3VyQ29udC5kZWZhdWx0RnJvbScsICdjdXJDb250LmRlZmF1bHRUbyddLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlRGF0YSgpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLiR3YXRjaEdyb3VwKFsnY3VyQ29udC5pbnB1dFRvRXhjaGFuZ2UnLCAnY3VyQ29udC5kZWZhdWx0UGVyY2FudGFnZSddLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudG9FeGNoYW5nZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy50b0V4Y2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBleGNoYW5nZVZhbHVlID0gQVBJc2VydmljZS5jYWxjRXhjaGFuZ2VWYWx1ZSh0aGlzLmlucHV0VG9FeGNoYW5nZSwgdGhpcy5yYXRlLCB0aGlzLmRlZmF1bHRQZXJjYW50YWdlKTtcbiAgICAgICAgdGhpcy5pbnB1dFRvR2V0ID0gK2V4Y2hhbmdlVmFsdWUudG9GaXhlZCgyKTtcbiAgICB9O1xuXG4gICAgdGhpcy5yZXZlcnRFeGNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgW3RoaXMuZGVmYXVsdEZyb20sIHRoaXMuZGVmYXVsdFRvXSA9IFt0aGlzLmRlZmF1bHRUbywgdGhpcy5kZWZhdWx0RnJvbV07XG4gICAgICAgIFt0aGlzLmlucHV0VG9FeGNoYW5nZSwgdGhpcy5pbnB1dFRvR2V0XSA9IFt0aGlzLmlucHV0VG9HZXQsIHRoaXMuaW5wdXRUb0V4Y2hhbmdlXTtcbiAgICAgICAgdGhpcy51cGRhdGVEYXRhKCk7XG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlRGF0YSA9ICgpID0+IHtcbiAgICAgICAgQVBJc2VydmljZS5nZXRSYXRlKHRoaXMuZGVmYXVsdEZyb20sIHRoaXMuZGVmYXVsdFRvKVxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yYXRlID0gZGF0YTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvRXhjaGFuZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG59XSk7XG4iXX0=
