/* Lassi Emotions - Interactive Controls Component */

export class ControlsComponent {
  constructor(containerEl, engine, i18nManager) {
    this.container = containerEl;
    this.engine = engine;
    this.i18n = i18nManager;

    this.categoryTabsContainer = document.getElementById('category-tabs');
    this.emotionsGrid = document.getElementById('emotions-grid');
    this.searchInput = document.getElementById('emotion-search');

    this.intensitySlider = document.getElementById('slider-intensity');
    this.intensityVal = document.getElementById('val-intensity');
    
    this.waveSlider = document.getElementById('slider-wave');
    this.waveVal = document.getElementById('val-wave');

    this.toppingSelect = document.getElementById('select-topping');
    this.themeSelect = document.getElementById('select-theme');

    this.btnRandom = document.getElementById('btn-random');
    this.btnReset = document.getElementById('btn-reset');
    this.btnFavorite = document.getElementById('btn-favorite');

    this.bindEvents();
  }

  bindEvents() {
    // Search Filter Input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.engine.setSearchFilter(e.target.value);
      });
    }

    // Intensity Slider
    if (this.intensitySlider) {
      this.intensitySlider.addEventListener('input', (e) => {
        this.engine.setIntensity(e.target.value);
      });
    }

    // Wave Speed Slider
    if (this.waveSlider) {
      this.waveSlider.addEventListener('input', (e) => {
        this.engine.setWaveSpeed(e.target.value);
      });
    }

    // Toppings Dropdown
    if (this.toppingSelect) {
      this.toppingSelect.addEventListener('change', (e) => {
        this.engine.setTopping(e.target.value);
      });
    }

    // Theme Dropdown
    if (this.themeSelect) {
      this.themeSelect.addEventListener('change', (e) => {
        this.engine.setTheme(e.target.value);
      });
    }

    // Control Buttons
    if (this.btnRandom) {
      this.btnRandom.addEventListener('click', () => this.engine.randomEmotion());
    }
    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => this.engine.reset());
    }
    if (this.btnFavorite) {
      this.btnFavorite.addEventListener('click', () => this.engine.toggleFavorite());
    }
  }

  renderCategoryTabs(state) {
    if (!this.categoryTabsContainer) return;
    this.categoryTabsContainer.innerHTML = '';

    const categories = this.engine.dataset.categories;
    Object.keys(categories).forEach(catId => {
      const cat = categories[catId];
      const btn = document.createElement('button');
      btn.className = `tab-btn ${state.categoryFilter === catId ? 'active' : ''}`;
      const label = this.i18n.lang === 'hi' ? cat.hi : cat.en;
      btn.innerHTML = `${cat.icon} ${label}`;

      btn.addEventListener('click', () => {
        this.engine.setCategoryFilter(catId);
      });

      this.categoryTabsContainer.appendChild(btn);
    });
  }

  renderEmotionsGrid(state) {
    if (!this.emotionsGrid) return;
    this.emotionsGrid.innerHTML = '';

    const filtered = this.engine.getFilteredEmotions();
    const favs = state.userData.favorites || [];

    filtered.forEach(emo => {
      const card = document.createElement('div');
      const isActive = state.currentEmotion === emo.id;
      const isFav = favs.includes(emo.id);
      
      card.className = `emotion-card ${isActive ? 'active' : ''}`;
      const name = this.i18n.lang === 'hi' ? emo.nameHi : emo.nameEn;
      
      card.innerHTML = `
        <span>${name}</span>
        <span class="card-icon">${isFav ? '❤️' : ''}</span>
      `;

      card.addEventListener('click', () => {
        this.engine.setEmotion(emo.id);
      });

      this.emotionsGrid.appendChild(card);
    });
  }

  render(state) {
    this.renderCategoryTabs(state);
    this.renderEmotionsGrid(state);

    if (this.intensityVal) {
      const val = typeof state.intensity === 'number' && !isNaN(state.intensity) ? state.intensity : 1.0;
      this.intensityVal.textContent = `${Math.round(val * 100)}%`;
    }
    if (this.waveVal) {
      this.waveVal.textContent = `${state.waveSpeed}x`;
    }
    if (this.toppingSelect) {
      this.toppingSelect.value = state.topping;
    }
    if (this.themeSelect) {
      this.themeSelect.value = state.theme;
    }
    if (this.btnFavorite) {
      const isFav = (state.userData.favorites || []).includes(state.currentEmotion);
      this.btnFavorite.style.borderColor = isFav ? 'var(--accent-pink)' : '';
      this.btnFavorite.style.color = isFav ? 'var(--accent-pink)' : '';
    }
  }
}
