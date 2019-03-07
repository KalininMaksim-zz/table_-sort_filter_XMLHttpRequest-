const xhr = new XMLHttpRequest();
const companies = new Set();
let users = [];


xhr.open('GET', 'https://next.json-generator.com/api/json/get/E1HDvnx1I', false);
xhr.send();

if (xhr.readyState === 4 && xhr.status != 200) {
  alert(xhr.status + ': ' + xhr.statusText);
} else {
  users = JSON.parse(xhr.responseText);
}

generateTable(users);
createListOfCompanies();

function generateTable(users) {

  const tbody = document.querySelector('#tbody');
  tbody.innerHTML = '';

  users.forEach((element) => {
    const tr = document.createElement('tr');
    const tableKeys = [element.name.first, element.name.last, element.sex, element.age, element.email, element.phone, element.company];
    tableKeys.forEach((item)=>{
      const td = document.createElement('td');
      td.innerHTML = item;
      tr.appendChild(td);
    })
    tbody.appendChild(tr);
    companies.add(element.company);
  });
}

function createListOfCompanies() {
  const selectList = document.querySelector('#listCompany');

  companies.forEach((companyName) => {
    const option = document.createElement('option');
    option.text = companyName;
    selectList.appendChild(option);
  });
}

document.querySelector('thead').onclick = function (element) {
  sort(element.target);
};

function sort(element) {
  const field = element.dataset.field;
  const dataType = element.dataset.type;
  const flag = +element.dataset.flag;
  const usersForSort = users;
  switch (dataType) {
    case 'number': usersForSort.sort((a, b) => flag * (a.age - b.age));
      break;

    case 'string': usersForSort.sort((a, b) => a[field] > b[field] ? flag * 1 : flag * (-1));
      break;
  }

  element.dataset.flag = flag * (-1);
  generateTable(usersForSort);
}

function searchTable() {
  let found;
  const query = document.querySelector('#query');
  const filter = query.value.toLocaleLowerCase();
  const table = document.querySelector('#tbody');
  const tr = table.querySelectorAll('tr');

  tr.forEach((itemI) => {
    const td = itemI.querySelectorAll('td');
    td.forEach((itemj)=> {
      if(itemj.innerHTML.toLocaleLowerCase().indexOf(filter) > (-1) ){
        found = true;
      }
    })

    if(found) {
      itemI.style.display = '';
      found = false;
    } else {
      itemI.style.display = 'none';
    }
  });
}

function filterOut() {
  const gender = document.querySelector('#gender').value;
  const company = document.querySelector('#listCompany').value;
  const ageFrom = +document.querySelector('#age-from').value;
  const ageTo = +document.querySelector('#age-to').value;

  let sortedUsers = [...users];

  if (gender !== '' && gender !== 'All') {
    sortedUsers = sortedUsers.filter((user) => user.sex.startsWith(gender));
  }

  if (company !== '' && company !== 'All') {
    sortedUsers = sortedUsers.filter((user) => user.company.startsWith(company));
  }

  if (ageFrom !== 0 || ageTo !== 100) {
    sortedUsers = sortedUsers.filter((user) => +user.age < ageTo && +user.age > ageFrom);
  }

  generateTable(sortedUsers);
}