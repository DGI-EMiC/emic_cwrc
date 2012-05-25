(function(tinymce) {
	var DOM = tinymce.DOM, Event = tinymce.dom.Event;

	tinymce.create('tinymce.ui.ScrollingMenuButton:tinymce.ui.MenuButton', {
		ScrollingMenuButton : function(id, s, ed) {
			this.parent(id, s, ed);

			this.beforeShowMenu = new tinymce.util.Dispatcher(this);
			this.onRenderMenu = new tinymce.util.Dispatcher(this);

			s.menu_container = s.menu_container || DOM.doc.body;
		},

		showMenu : function() {
			var t = this, p2, e = DOM.get(t.id), m;

			if (t.isDisabled())
				return;

			t.beforeShowMenu.dispatch(t);
			
			if (!t.isMenuRendered) {
				t.renderMenu();
				t.isMenuRendered = true;
			}

			if (t.isMenuVisible)
				return t.hideMenu();

			p1 = DOM.getPos(t.settings.menu_container);
			p2 = DOM.getPos(e);

			m = t.menu;
			m.settings.offset_x = p2.x;
			m.settings.offset_y = p2.y;
			m.settings.vp_offset_x = p2.x;
			m.settings.vp_offset_y = p2.y;
			m.settings.keyboard_focus = t._focused;
			m.showMenu(0, e.clientHeight);

			Event.add(DOM.doc, 'mousedown', t.hideMenu, t);
			t.setState('Selected', 1);

			t.isMenuVisible = 1;
		},
		
		renderMenu : function() {
			var t = this, m;

			m = t.settings.control_manager.createDropMenu(t.id + '_menu', {
				menu_line : 1,
				'class' : this.classPrefix + 'Menu',
				icons : t.settings.icons
			}, tinymce.ui.ScrollingDropMenu);

			m.onHideMenu.add(function() {
				t.hideMenu();
				t.focus();
			});

			t.onRenderMenu.dispatch(t, m);
			t.menu = m;
		}
	});
})(tinymce);

(function(tinymce) {
	var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event, Element = tinymce.dom.Element;

	tinymce.create('tinymce.ui.ScrollingDropMenu:tinymce.ui.DropMenu', {
		ScrollingDropMenu : function(id, s) {
			s = s || {};
			s.container = s.container || DOM.doc.body;
			s.offset_x = s.offset_x || 0;
			s.offset_y = s.offset_y || 0;
			s.vp_offset_x = s.vp_offset_x || 0;
			s.vp_offset_y = s.vp_offset_y || 0;

			if (is(s.icons) && !s.icons)
				s['class'] += ' mceNoIcons';

			this.parent(id, s);
			this.beforeShowMenu = new tinymce.util.Dispatcher(this);
			this.onShowMenu = new tinymce.util.Dispatcher(this);
			this.onHideMenu = new tinymce.util.Dispatcher(this);
			this.classPrefix = 'mceMenu';
			
			this.scrollbarSize = this.getScrollbarSize();
		},

		getScrollbarSize : function() {
			document.body.style.overflow = 'hidden';
			var width = document.body.clientWidth;
			
			document.body.style.overflow = 'scroll';
			width -= document.body.clientWidth;
			
			if(!width) width = document.body.offsetWidth-document.body.clientWidth;
			
			document.body.style.overflow = '';
			
			return width;
		},
		
		update : function() {
			var t = this, s = t.settings, tb = DOM.get('menu_' + t.id + '_tbl'), co = DOM.get('menu_' + t.id + '_co'), tw, th;

			var max_height = tinyMCE.activeEditor.getContentAreaContainer().offsetHeight - 50;
			
			tw = s.max_width ? Math.min(tb.clientWidth, s.max_width) : tb.clientWidth;
			th = max_height ? Math.min(tb.clientHeight, max_height) : tb.clientHeight;

			var doScroll = tb.clientHeight > max_height;
			if (doScroll) {
				tw += t.scrollbarSize;
			}
			
			if (!DOM.boxModel) {
				t.element.setStyles({width : tw + 2, height : th + 2});
				DOM.setStyle(co, 'height', th + 2);
			} else {
				t.element.setStyles({width : tw, height : th});
				DOM.setStyle(co, 'height', th);
			}

			if (s.max_width)
				DOM.setStyle(co, 'width', tw);

			if (doScroll) {
				DOM.setStyle(co, 'overflow', 'auto');
				DOM.setStyle(co, 'width', tw);
				DOM.setStyle(tb, 'width', tw - t.scrollbarSize);
			} else {
				DOM.setStyle(co, 'overflow', 'hidden');
				DOM.setStyle(co, 'width', tw);
				DOM.setStyle(tb, 'width', tw);
			}
			$(co).scrollTop(0);
		},

		showMenu : function(x, y, px) {
			var t = this, s = t.settings, co, vp = DOM.getViewPort(), w, h, mx, my, ot = 2, dm, cp = t.classPrefix;

			t.collapse(1);

			if (t.isMenuVisible)
				return;

			if (!t.rendered) {
				co = DOM.add(t.settings.container, t.renderNode());

				each(t.items, function(o) {
					o.postRender();
				});

				t.element = new Element('menu_' + t.id, {blocker : 1, container : s.container});
			} else
				co = DOM.get('menu_' + t.id);

			// Move layer out of sight unless it's Opera since it scrolls to top of page due to an bug
			if (!tinymce.isOpera)
				DOM.setStyles(co, {left : -0xFFFF , top : -0xFFFF});

			t.beforeShowMenu.dispatch(t);
			
			DOM.show(co);
			t.update();

			x += s.offset_x || 0;
			y += s.offset_y || 0;
			vp.w -= 4;
			vp.h -= 4;

			// Move inside viewport if not submenu
			if (s.constrain) {
				var size = DOM.getSize(co);
				w = size.w - ot;
				h = size.h - ot;
				mx = vp.x + vp.w;
				my = vp.y + vp.h;

				if ((x + s.vp_offset_x + w) > mx)
					x = px ? px - w : Math.max(0, (mx - s.vp_offset_x) - w);

				if ((y + s.vp_offset_y + h) > my)
					y = Math.max(0, (my - s.vp_offset_y) - h);
			}

			DOM.setStyles(co, {left : x , top : y});
			t.element.update();

			t.isMenuVisible = 1;
			t.mouseClickFunc = Event.add(co, 'click', function(e) {
				var m;

				e = e.target;

				if (e && (e = DOM.getParent(e, 'tr')) && !DOM.hasClass(e, cp + 'ItemSub')) {
					m = t.items[e.id];

					if (m.isDisabled())
						return;

					dm = t;

					while (dm) {
						if (dm.hideMenu)
							dm.hideMenu();

						dm = dm.settings.parent;
					}

					if (m.settings.onclick)
						m.settings.onclick(e);

					return Event.cancel(e); // Cancel to fix onbeforeunload problem
				}
			});

			if (t.hasMenus()) {
				t.mouseOverFunc = Event.add(co, 'mouseover', function(e) {
					var m, r;

					e = e.target;
					if (e && (e = DOM.getParent(e, 'tr'))) {
						m = t.items[e.id];

						if (t.lastMenu)
							t.lastMenu.collapse(1);

						if (m.isDisabled())
							return;

						if (e && DOM.hasClass(e, cp + 'ItemSub')) {
							//p = DOM.getPos(s.container);
							r = DOM.getRect(e);
							m.showMenu((r.x + r.w - ot), r.y - ot, r.x);
							t.lastMenu = m;
							DOM.addClass(DOM.get(m.id).firstChild, cp + 'ItemActive');
						}
					}
				});
			}
			
			Event.add(co, 'keydown', t._keyHandler, t);

			t.onShowMenu.dispatch(t);

			if (s.keyboard_focus) { 
				t._setupKeyboardNav(); 
			}
		},
		
		addMenu : function(o) {
			if (!o.collapse)
				o = this.createMenu(o);

			this.menuCount++;

			return this.add(o);
		},
		
		createMenu : function(s) {
			var t = this, cs = t.settings, m;

			s.container = s.container || cs.container;
			s.parent = t;
			s.constrain = s.constrain || cs.constrain;
			s['class'] = s['class'] || cs['class'];
			s.vp_offset_x = s.vp_offset_x || cs.vp_offset_x;
			s.vp_offset_y = s.vp_offset_y || cs.vp_offset_y;
			s.keyboard_focus = cs.keyboard_focus;
			m = new tinymce.ui.ScrollingDropMenu(s.id || DOM.uniqueId(), s);

			m.onAddItem.add(t.onAddItem.dispatch, t.onAddItem);

			return m;
		}
	});
})(tinymce);