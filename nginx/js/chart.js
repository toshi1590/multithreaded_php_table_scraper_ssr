const chart_form = document.getElementById('chart_form');
const chart_section = document.getElementById('chart_section');

function display_chart_form () {
  const form_check_1 = document.createElement('div');
  form_check_1.setAttribute('class', 'form-check');
  const group_by_a_column_radio = get_input('radio', 'form-check-input', 'condition', '');
  group_by_a_column_radio.setAttribute('onchange', 'append_titles_in_group_by_a_column_section()');
  group_by_a_column_radio.setAttribute('id', 'group_by_a_column_radio');
  const text_node_1 = document.createTextNode('group by a column');
  const group_by_a_column_section = document.createElement('div');
  group_by_a_column_section.setAttribute('id', 'group_by_a_column_section');
  form_check_1.appendChild(group_by_a_column_radio);
  form_check_1.appendChild(text_node_1);
  form_check_1.appendChild(group_by_a_column_section);
  chart_form.appendChild(form_check_1);

  const form_check_2 = document.createElement('div');
  form_check_2.setAttribute('class', 'form-check');
  const range_radio = get_input('radio', 'form-check-input', 'condition', '');
  range_radio.setAttribute('onchange', 'append_titles_in_range_section()');
  range_radio.setAttribute('id', 'range_radio');
  const text_node_2 = document.createTextNode('range');
  const range_section = document.createElement('div');
  range_section.setAttribute('id', 'range_section');
  form_check_2.appendChild(range_radio);
  form_check_2.appendChild(text_node_2);
  form_check_2.appendChild(range_section);
  chart_form.appendChild(form_check_2);

  const form_check_3 = document.createElement('div');
  form_check_3.setAttribute('class', 'form-check');
  const keyword_radio = get_input('radio', 'form-check-input', 'condition', '');
  keyword_radio.setAttribute('onchange', 'append_titles_in_keyword_section()');
  keyword_radio.setAttribute('id', 'keyword_radio');
  const text_node_3 = document.createTextNode('keyword');
  const keyword_section = document.createElement('div');
  keyword_section.setAttribute('id', 'keyword_section');
  form_check_3.appendChild(keyword_radio);
  form_check_3.appendChild(text_node_3);
  form_check_3.appendChild(keyword_section);
  chart_form.appendChild(form_check_3);

  const see_chart_btn = get_btn('see chart', 'btn btn-primary', 'see_chart_btn', 'judge()');
  chart_form.appendChild(see_chart_btn);
}

function append_titles(section) {
  const select = document.createElement('select');
  select.setAttribute('class', 'form-select mt-1 mb-1');
  select.setAttribute('name', 'title_number')

  for (let i = 1; i < scraped_data[0].length; i++) {
    const option = document.createElement('option');
    option.setAttribute('value', i);
    const option_text = document.createTextNode(scraped_data[0][i]);
    option.appendChild(option_text);
    select.appendChild(option);
  }

  section.appendChild(select);
}

function append_titles_in_group_by_a_column_section () {
  range_section.innerHTML = '';
  keyword_section.innerHTML = '';

  append_titles(group_by_a_column_section);
}

function append_titles_in_range_section () {
  group_by_a_column_section.innerHTML = '';
  keyword_section.innerHTML = '';

  append_titles(range_section);

  const add_btn = get_btn('add', 'btn btn-primary mb-1', 'range_add_btn', 'add_range()');
  range_section.appendChild(add_btn);

  const min = get_input('number', 'form-control', 'mins[]', 'min');
  const max = get_input('number', 'form-control', 'maxs[]', 'max');
  const delete_btn = get_btn('delete', 'btn btn-danger', '', 'delete_tr(this)');
  const table = get_table();
  range_section.appendChild(table);
  table.querySelector('tbody').setAttribute('id', 'tbody_of_range_table');
  const elements_for_tds = [min, max, delete_btn];
  add_tr_in_tbody(elements_for_tds, tbody_of_range_table);
}

function add_range () {
  const min = get_input('number', 'form-control', 'mins[]', 'min');
  const max = get_input('number', 'form-control', 'maxs[]', 'max');
  const delete_btn = get_btn('delete', 'btn btn-danger', '', 'delete_tr(this)');
  const elements_for_tds = [min, max, delete_btn];
  add_tr_in_tbody(elements_for_tds, tbody_of_range_table);
}

function append_titles_in_keyword_section () {
  group_by_a_column_section.innerHTML = '';
  range_section.innerHTML = '';

  append_titles(keyword_section);

  const add_btn = get_btn('add', 'btn btn-primary mb-1', 'keyword_add_btn', 'add_keyword_input()');
  keyword_section.appendChild(add_btn);

  const keyword_input = get_input('text', 'form-control', 'keywords[]', 'keyword');
  const delete_btn = get_btn('delete', 'btn btn-danger', '', 'delete_tr(this)');
  const table = get_table();
  keyword_section.appendChild(table);
  table.querySelector('tbody').setAttribute('id', 'tbody_of_keyword_table');
  const elements_for_tds = [keyword_input, delete_btn];
  add_tr_in_tbody(elements_for_tds, tbody_of_keyword_table);
}

function add_keyword_input () {
  const keyword_input = get_input('text', 'form-control', 'keywords[]', 'keyword');
  const delete_btn = get_btn('delete', 'btn btn-danger', '', 'delete_tr(this)');
  const elements_for_tds = [keyword_input, delete_btn];
  add_tr_in_tbody(elements_for_tds, tbody_of_keyword_table);
}

function judge () {
  const title_number = parseInt(document.querySelector('select[name="title_number"]').value);

  if (group_by_a_column_radio.checked) {
    const data_for_title_number = [];
    let total = 0;

    for (let i = 1; i < scraped_data.length; i++) {
      data_for_title_number.push(scraped_data[i][title_number]);
      total++;
    }

    // get distinct data
    let counted_data = {};

    for (let i = 0; i < data_for_title_number.length; i++) {
      var key = data_for_title_number[i];

      if (counted_data[key] == undefined) {
        counted_data[key] = 0;
      }

      counted_data[key]++;
    }

    var array = Object.keys(counted_data).map((k)=>({ key: k, value: counted_data[k] }));

    array.sort((a, b) => b.value - a.value);

    counted_data = Object.assign({}, ...array.map((item) => ({
      [item.key]: item.value,
    })));

    // get labels from counted_data
    let labels = [];

    for (key in counted_data){
      const percentage = Math.round(((counted_data[key] / total) * 100) * 10) / 10;
      labels.push(key + " (" + percentage + "%)");
    }

    // get values from counted_data
    let values = [];

    for (key in counted_data){
      values.push(counted_data[key]);
    }

    display_chart(labels, values, title_number, total)
  } else if (range_radio.checked) {
    const mins = document.getElementsByName('mins[]');
    const maxs = document.getElementsByName('maxs[]');

    if (mins.length != 0 && maxs.length != 0) {
      let empty_check_flag;

      for (let i = 0; i < mins.length; i++) {
        if (mins[i].value == '' || maxs[i].value == '') {
          alert('fill in blanks');
          empty_check_flag = false;
          break;
        }

        empty_check_flag = true
      }

      if (empty_check_flag == true) {
        let ranges = [];
        let range_groups = [];

        for (let i = 0; i < mins.length; i++) {
          ranges.push(mins[i].value + ' - ' + maxs[i].value);
          range_groups.push(new Array());
        }

        let unsorted_data = [];
        let total = 0;

        for (let i = 1; i < scraped_data.length; i++) {
          unsorted_data.push(scraped_data[i]);
          total++;
        }

        for (let i = 0; i < range_groups.length; i++) {
          for (let j = 0; j < unsorted_data.length; j++) {
            if (unsorted_data[j][title_number].match(/[0-9]+,[0-9]+/) != null) {
              if (unsorted_data[j][title_number].replace(/,/g, '') >= parseFloat(mins[i].value) && unsorted_data[j][title_number].replace(/,/g, '') <= parseFloat(maxs[i].value)) {
                range_groups[i].push(unsorted_data[j]);
                unsorted_data.splice(j, 1);
                j--;
              }
            } else {
              if (unsorted_data[j][title_number] >= parseFloat(mins[i].value) && unsorted_data[j][title_number] <= parseFloat(maxs[i].value)) {
                range_groups[i].push(unsorted_data[j]);
                unsorted_data.splice(j, 1);
                j--;
              }
            }
          }
        }

        if (unsorted_data.length != 0) {
          ranges.push('the other');
          range_groups.push(unsorted_data);
        }

        let labels = ranges;

        for (let i = 0; i < range_groups.length; i++) {
          const percentage = Math.round(((range_groups[i].length / total) * 100) * 10) / 10;
          labels[i] = labels[i].concat(" (" + percentage + "%)");
        }

        let values = [];

        range_groups.forEach(function(element){
          values.push(element.length);
        })

        display_chart(labels, values, title_number, total);
      }
    }
  } else if (keyword_radio.checked) {
    const keyword_inputs = document.getElementsByName('keywords[]');

    if (keyword_inputs.length != 0) {
      let empty_check_flag;

      for (let i = 0; i < keyword_inputs.length; i++) {
        if (keyword_inputs[i].value == '') {
          alert('fill in blanks');
          empty_check_flag = false;
          break;
        }

        empty_check_flag = true
      }

      if (empty_check_flag == true) {
        let keywords = [];
        let keyword_groups = [];

        for (let i = 0; i < keyword_inputs.length; i++) {
          keywords.push(keyword_inputs[i].value);
          keyword_groups.push(new Array());
        }

        let unsorted_data = [];
        let total = 0;

        for (let i = 1; i < scraped_data.length; i++) {
          unsorted_data.push(scraped_data[i]);
          total++;
        }

        for (let i = 0; i < keyword_groups.length; i++) {
          for (let j = 0; j < unsorted_data.length; j++) {
            if (unsorted_data[j][title_number].includes(keywords[i])) {
              keyword_groups[i].push(unsorted_data[j]);
              unsorted_data.splice(j, 1);
              j--;
            }
          }
        }

        if (unsorted_data.length != 0) {
          keywords.push('the other');
          keyword_groups.push(unsorted_data);
        }

        let labels = keywords;

        for (let i = 0; i < keyword_groups.length; i++) {
          const percentage = Math.round(((keyword_groups[i].length / total) * 100) * 10) / 10;
          labels[i] = labels[i].concat(" (" + percentage + "%)");
        }

        let values = [];

        keyword_groups.forEach(function(element){
          values.push(element.length);
        })

        display_chart(labels, values, title_number, total);
      }
    }
  }
}

function display_chart(labels, values, title_number, total) {
  chart_section.classList.remove('hidden');
  chart_section.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'chart');
  chart_section.appendChild(canvas);

  var chart = new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        backgroundColor: background_colors,
        data: values
      }]
    },
    options: {
      title: {
        display: true,
        text: scraped_data[0][title_number] + ` (total ${total})`
      }
    }
  });

  chart_section.scrollIntoView();
}
