const categories = [
  {
    id: '1',
    name: 'Produção e Qualidade',
    subtemas: [
      { id: '1.1', name: 'Mapeamento e Melhoria de Processos' },
      { id: '1.2', name: 'Cadeia de Suprimentos' },
      { id: '1.3', name: 'Gestão da Qualidade' },
      { id: '1.4', name: 'Certificação/ Inspeção' }
    ]
  },
  {
    id: '2',
    name: 'Design',
    subtemas: [
      { id: '2.1', name: 'Design de Ambiente' },
      { id: '2.2', name: 'Design de Comunicação' },
      { id: '2.3', name: 'Design de Produto' },
      { id: '2.4', name: 'Design de Serviço' }
    ]
  },
  {
    id: '3',
    name: 'Sustentabilidade',
    subtemas: [
      { id: '3.1', name: 'Gestão da Sustentabilidade' },
      { id: '3.2', name: 'Saúde e Segurança no Trabalho' },
      { id: '3.3', name: 'Eficiência Energética' },
      { id: '3.4', name: 'Água, Ar e Solo' },
      { id: '3.5', name: 'Resíduos' }
    ]
  },
  {
    id: '4',
    name: 'Desenvolvimento Tecnológico',
    subtemas: [
      { id: '4.1', name: 'Gestão da Inovação' },
      { id: '4.2', name: 'Planejamento Tecnológico' },
      { id: '4.3', name: 'Transformação Digital' },
      { id: '4.4', name: 'Melhoria genética e Biotecnologia' },
      { id: '4.5', name: 'Desenvolvimento do Produto' },
      { id: '4.6', name: 'Propriedade Intelectual' }
    ]
  }
];

const servicos = [
  { id: 'consultoria', name: 'Consultoria Tecnológica', icon: '🛠️' },
  { id: 'metrologicos', name: 'Serviços Metrológicos', icon: '📏' },
  { id: 'conformidade', name: 'Avaliação da Conformidade', icon: '✔️' },
  { id: 'prototipagem', name: 'Prototipagem', icon: '🧪' }
];

let solutions = [];
let editingIndex = null;
let currentCategoryFilter = null;
let currentSubtemaFilter = null;
let currentServicoFilter = null;

window.addEventListener('DOMContentLoaded', () => {
  buildMenu();
  buildServiceOptions();
  populateCategorySelect();
  populateServiceSelect();
  document.getElementById('solution-form').addEventListener('submit', saveSolution);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);
});

function buildMenu() {
  const sidebar = document.getElementById('sidebar');
  categories.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.className = 'menu-category';

    const title = document.createElement('div');
    title.className = 'menu-category-title';
    title.textContent = `${cat.id}. ${cat.name}`;
    const submenu = document.createElement('ul');
    submenu.className = 'submenu';

    title.addEventListener('click', () => {
      submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });

    cat.subtemas.forEach(sub => {
      const li = document.createElement('li');
      li.textContent = `${sub.id} - ${sub.name}`;
      li.dataset.catId = cat.id;
      li.dataset.subId = sub.id;
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        setSubtemaFilter(cat.id, sub.id);
      });
      submenu.appendChild(li);
    });

    catDiv.appendChild(title);
    catDiv.appendChild(submenu);
    sidebar.appendChild(catDiv);
  });
}

function buildServiceOptions() {
  const container = document.getElementById('services');
  servicos.forEach(s => {
    const div = document.createElement('div');
    div.className = 'service-option';
    div.dataset.id = s.id;
    div.innerHTML = `<div style="font-size:24px;">${s.icon}</div><span>${s.name}</span>`;
    div.addEventListener('click', () => setServiceFilter(s.id));
    container.appendChild(div);
  });
}

function populateCategorySelect() {
  const select = document.getElementById('category-select');
  select.innerHTML = '<option value="">Categoria</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = `${cat.id}. ${cat.name}`;
    select.appendChild(option);
  });
  select.addEventListener('change', populateSubtemaSelect);
}

function populateSubtemaSelect() {
  const categoryId = document.getElementById('category-select').value;
  const select = document.getElementById('subtema-select');
  select.innerHTML = '<option value="">Subtema</option>';
  const cat = categories.find(c => c.id === categoryId);
  if (cat) {
    cat.subtemas.forEach(sub => {
      const option = document.createElement('option');
      option.value = sub.id;
      option.textContent = `${sub.id} - ${sub.name}`;
      select.appendChild(option);
    });
  }
}

function populateServiceSelect() {
  const select = document.getElementById('service-select');
  select.innerHTML = '<option value="">Serviço Tecnológico</option>';
  servicos.forEach(s => {
    const option = document.createElement('option');
    option.value = s.id;
    option.textContent = s.name;
    select.appendChild(option);
  });
}

function saveSolution(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const categoryId = document.getElementById('category-select').value;
  const subtemaId = document.getElementById('subtema-select').value;
  const servicoId = document.getElementById('service-select').value;
  if (!title || !categoryId || !subtemaId || !servicoId) return;

  const solution = { title, categoryId, subtemaId, servicoId };
  if (editingIndex !== null) {
    solutions[editingIndex] = solution;
    editingIndex = null;
  } else {
    solutions.push(solution);
  }
  resetForm();
  renderSolutions();
}

function resetForm() {
  const form = document.getElementById('solution-form');
  form.reset();
  document.getElementById('cancel-btn').style.display = 'none';
  editingIndex = null;
}

function renderSolutions() {
  const tbody = document.querySelector('#solutions tbody');
  tbody.innerHTML = '';
  solutions
    .filter(sol => (
      (!currentCategoryFilter || sol.categoryId === currentCategoryFilter) &&
      (!currentSubtemaFilter || sol.subtemaId === currentSubtemaFilter) &&
      (!currentServicoFilter || sol.servicoId === currentServicoFilter)
    ))
    .forEach((sol, index) => {
      const tr = document.createElement('tr');
      const cat = categories.find(c => c.id === sol.categoryId);
      const sub = cat.subtemas.find(s => s.id === sol.subtemaId);
      const serv = servicos.find(s => s.id === sol.servicoId);
      tr.innerHTML = `
        <td>${sol.title}</td>
        <td>${cat.id}. ${cat.name}</td>
        <td>${sub.id} - ${sub.name}</td>
        <td>${serv.name}</td>
        <td class="actions">
          <button onclick="editSolution(${index})">Editar</button>
          <button onclick="deleteSolution(${index})">Apagar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

function editSolution(index) {
  const sol = solutions[index];
  document.getElementById('title').value = sol.title;
  document.getElementById('category-select').value = sol.categoryId;
  populateSubtemaSelect();
  document.getElementById('subtema-select').value = sol.subtemaId;
  document.getElementById('service-select').value = sol.servicoId;
  document.getElementById('cancel-btn').style.display = 'inline-block';
  editingIndex = index;
}

function deleteSolution(index) {
  solutions.splice(index, 1);
  renderSolutions();
}

function setServiceFilter(id) {
  currentServicoFilter = currentServicoFilter === id ? null : id;
  document.querySelectorAll('.service-option').forEach(div => {
    div.classList.toggle('selected', div.dataset.id === currentServicoFilter);
  });
  renderSolutions();
}

function setSubtemaFilter(catId, subId) {
  currentCategoryFilter = catId;
  currentSubtemaFilter = subId;
  document.querySelectorAll('#sidebar .submenu li').forEach(li => {
    li.classList.toggle('selected', li.dataset.subId === subId);
  });
  renderSolutions();
}
