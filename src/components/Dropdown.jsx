import React from "react";

function Dropdown({name,initialVal,onNewDropvalue}) {
  const options = [];
  for (let i = 1; i <= 100; i++) {
      options.push(
        <option key={i} value={i} className="bg-yellow-400 text-white">
          {i}
        </option>
      );
  
  }

  function manageDropdown(event){
    onNewDropvalue(event.target.value);
  }
  
  return (
    <div className="bg-yellow-400 p-2 rounded-md">
      <label htmlFor={name} className="text-white">{name}</label>
      <select onChange={manageDropdown} defaultValue={initialVal} className="focus:outline-none rounded-md scrollbar-thin scrollbar-thumb bg-white p-1" name="numbers" id={name}>
        {options}
      </select>
    </div>
  );
}

export default Dropdown;
