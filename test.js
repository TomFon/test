/* sohutv 2018-02-01 17:07:47 */
!(function (t, e) {
	function n() {}
	function i(t, e) {
		if (t && e) for (var n in e) t[n] = e[n];
	}
	function r(t) {
		var e,
			n = E.exec(t);
		return n && (e = n[1]), e;
	}
	function a(t) {
		var e = I[t];
		return (
			e ||
				(e = {
					path: t
				}),
			e
		);
	}
	function c(t) {
		var t = t || '';
		for (
			m.test(t) || (t = N.path + '/' + t),
				t = t.replace(d, '/').replace(p, '$1/');
			v.test(t);

		)
			t = t.replace(v, '/');
		return g.test(t) || (t = document.location.protocol + t), t;
	}
	function s(t, n) {
		var i = e.createElement('link');
		(i.type = 'text/css'),
			(i.rel = 'stylesheet'),
			(i.href = t),
			i.setAttribute('href', t),
			n && (i.charset = n),
			y.parentNode.insertBefore(i, y);
	}
	function o(t, i, r) {
		function a() {
			(c.onload = c.onreadystatechange = null),
				y.parentNode.removeChild(c),
				(c = null),
				r();
		}
		r = r || n;
		var c = e.createElement('script');
		(c.type = 'text/javascript'),
			(c.async = !0),
			i && (c.charset = i),
			(c.src = t),
			'onload' in c
				? (c.onload = a)
				: (c.onreadystatechange = function () {
						/loaded|complete/.test(c.readyState) && a();
				  }),
			y.parentNode.insertBefore(c, y);
	}
	function l(t, e) {
		function i() {
			(v -= 1) <= 0 && e();
		}
		e = e || n;
		var u,
			f,
			d,
			p,
			v = 0,
			g = 0,
			m = t.length;
		if (t && t.length) {
			for (; g < m; g++)
				(u = a(t[g])),
					(f = c(u.path)),
					(d = u.requires),
					(charset = u.charset),
					'css' != u.type && '.css' != r(f)
						? D[f] ||
						  ((v += 1),
						  S.on(f, i),
						  C[f] ||
								((p = (function (t, e) {
									return function () {
										C[t] ||
											D[t] ||
											((C[t] = h),
											o(t, e, function () {
												delete C[t],
													(D[t] = h),
													S.emit(t);
											}));
									};
								})(f, charset)),
								d && d.length ? l(d, p) : p()))
						: O[f] || ((O[f] = h), s(f, u.charset));
			0 == v && i();
		} else e();
	}
	function u() {
		var t = [].slice.call(arguments),
			e = n;
		T(t[t.length - 1]) && (e = t.pop()), t.length ? l(t, e) : e();
	}
	var f,
		h = {},
		d = /\/\.\//g,
		p = /([^:])\/+\//g,
		v = /\/[^\/]+\/\.\.\//,
		g = /^[^:\/]+:\/\//,
		m = /^(?:[a-zA-Z]+?:)?\/\/.+?/,
		E = /(\.[^\.]+)(?=[\?#]|$)/,
		y = (function () {
			var t = e.getElementsByTagName('script');
			return t[t.length - 1];
		})(),
		b = function (t) {
			return function (e) {
				return {}.toString.call(e) == '[object ' + t + ']';
			};
		},
		x = b('Object'),
		T = b('Function'),
		A = b('String'),
		S = {
			events: {},
			on: function (t, e, n) {
				if (t && e) {
					this.events[t] = this.events[t] || [];
					for (
						var i, r, a = this.events[t], c = a.length - 1;
						c >= 0;
						c--
					)
						if (((i = a[c]), i.h == e)) {
							r = !0;
							break;
						}
					r ||
						a.push({
							h: e,
							one: n
						});
				}
			},
			emit: function (t, e) {
				if (t)
					for (
						var n, i, r = this.events[t] || [], a = 0;
						a < r.length;

					)
						(n = r[a]),
							(i = n.h),
							T(i)
								? i.call(null, e, t)
								: x(i) &&
								  T(i.handleEvent) &&
								  i.handleEvent.call(i, t, e),
							n.one ? r.splice(a, 1) : a++;
			},
			one: function (t, e) {
				this.on(t, e, !0);
			}
		},
		N = {
			path: (function () {
				return (
					/^(?:[a-zA-Z]+?:)?(\/\/.+?)[\/\?#]/.exec(y.src), RegExp.$1
				);
			})()
		},
		D = {},
		C = {},
		O = {},
		I = {};
	(u.add = function (t, e) {
		var n;
		A(t) &&
			(A(e)
				? (n = {
						path: e
				  })
				: x(e) && e.path && (n = e),
			n && (I[t] = n));
	}),
		(u.config = function (t) {
			i(N, t);
		}),
		(t.kao = u),
		(f = y.getAttribute('data-path')) && (N.path = f),
		(f = y.getAttribute('data-main')) && u(f);
})(this, document),
	(function (t, e, n) {
		var i = !1,
			r = [],
			a = function () {
				for (var t, e = 0; (t = r[e++]); ) t.call(this);
			};
		!(function (t, e) {
			var n = !1,
				i = !0,
				r = t.document,
				a = r.documentElement,
				c = r.addEventListener ? 'addEventListener' : 'attachEvent',
				s = r.addEventListener ? 'removeEventListener' : 'detachEvent',
				o = r.addEventListener ? '' : 'on',
				l = function (i) {
					('readystatechange' == i.type &&
						'complete' != r.readyState) ||
						(('load' == i.type ? t : r)[s](o + i.type, l, !1),
						!n && (n = !0) && e.call(t, i.type || i));
				},
				u = function () {
					try {
						a.doScroll('left');
					} catch (t) {
						return void setTimeout(u, 50);
					}
					l('poll');
				};
			if ('complete' == r.readyState) e.call(t, 'lazy');
			else {
				if (r.createEventObject && a.doScroll) {
					try {
						i = !t.frameElement;
					} catch (f) {}
					i && u();
				}
				r[c](o + 'DOMContentLoaded', l, !1),
					r[c](o + 'readystatechange', l, !1),
					t[c](o + 'load', l, !1);
			}
		})(this, function () {
			(i = !0), a();
		}),
			(n.ready = function () {
				var e,
					n = [].slice.call(arguments),
					a = 0;
				if (i) for (; (e = n[a++]); ) e.call(t);
				else
					for (; (e = n.shift()); )
						'function' == typeof e && r.push(e);
			});
	})(this, document, kao),
	(function (t, e) {
		'use strict';
		function n() {
			return '_cola_anony_mod_' + N++;
		}
		function i(t) {
			t = t
				.replace(/^\s*\/\/.*(?=[\n\t])/gm, '')
				.replace(/^\s*\/\*[\s\S]*?\*\/\s*$/gm, '');
			for (var e, n, i = '', r = 0, a = !1, c = !1; (e = t[r++]); )
				a ||
					c ||
					("'" != e && '"' != e) ||
					(n ? n == e && (n = '') : (n = e)),
					n
						? (i += e)
						: a || c
						? a
							? '\n' == e && (a = !1)
							: '/' == e && '*' == t[r - 2] && (c = !1)
						: '/' == e && '/' == t[r]
						? (a = !0)
						: '/' == e && '*' == t[r]
						? (c = !0)
						: (i += e);
			return i;
		}
		function r(t) {
			for (var e = [], n = {}, i = 0, r = t.length; i < r; i++)
				n[t[i]] || ((n[t[i]] = 1), e.push(t[i]));
			return e;
		}
		function a(t) {
			if (((t = i(t)), '-1' == t.indexOf('require'))) return [];
			for (var e, n = []; (e = D.exec(t)); ) n.push(e[1]);
			return r(n);
		}
		function c(t) {
			return (t = t.split('?')[0].split('#')[0]);
		}
		function s(t) {
			return A[t];
		}
		function o(t, e) {
			if (E(t)) {
				var n = t;
				if ((s(t) && (t = s(t).path), F.test(t)))
					return j.test(t) ? t : document.location.protocal + t;
				var i = T.path;
				(0 == t.indexOf('../') || 0 == t.indexOf('./')) &&
					e &&
					F.test(e) &&
					(i = e.replace(L, ''));
				var r = i + '/' + t;
				for (r = r.replace(C, '/').replace(O, '$1/'); I.test(r); )
					r = r.replace(I, '/');
				return (
					s(n) ||
						((r = c(r)),
						'/' == r[r.length - 1]
							? (r += T.main)
							: '.js' != r.substring(r.length - 3) &&
							  (r += '.js')),
					r
				);
			}
		}
		function l(t, e, n) {
			(this.uri = t),
				(this.deps = e || []),
				(this.factory = n),
				(this.exports = {});
		}
		var u,
			f = {
				version: '1.0.0'
			},
			h = function () {},
			d = function (t, e) {
				if (e && 'object' == typeof e) for (var n in e) t[n] = e[n];
			},
			p = function (t) {
				return function (e) {
					return {}.toString.call(e) == '[object ' + t + ']';
				};
			},
			v = p('Object'),
			g = p('Function'),
			m = Array.isArray || p('Array'),
			E = p('String'),
			y = {
				events: {},
				on: function (t, e, n) {
					if (t && e) {
						this.events[t] = this.events[t] || [];
						for (
							var i, r, a = this.events[t], c = a.length - 1;
							c >= 0;
							c--
						)
							if (((i = a[c]), i.h == e)) {
								r = !0;
								break;
							}
						r ||
							a.push({
								h: e,
								one: n
							});
					}
				},
				emit: function (t, e) {
					if (t)
						for (
							var n, i, r = this.events[t] || [], a = 0;
							a < r.length;

						)
							(n = r[a]),
								(i = n.h),
								g(i)
									? i.call(null, e, t)
									: v(i) &&
									  g(i.handleEvent) &&
									  i.handleEvent.call(i, t, e),
								n.one ? r.splice(a, 1) : a++;
				},
				one: function (t, e) {
					this.on(t, e, !0);
				}
			},
			b = {
				currentAddingScript: null,
				interactiveScript: null,
				head:
					document.head ||
					document.getElementsByTagName('head')[0] ||
					document.documentElement,
				load: function (t, e, n) {
					function i() {
						(a.onerror = a.onload = a.onreadystatechange = null),
							r && a.parentNode && r.removeChild(a),
							(a = null),
							e();
					}
					e = e || h;
					var r = this.head,
						a = document.createElement('script');
					a.setAttribute('type', 'text/javascript'),
						a.setAttribute('async', !0),
						n && (a.charset = n),
						(a.src = t),
						'onload' in a
							? (a.onload = i)
							: (a.onreadystatechange = function () {
									/loaded|complete/.test(a.readyState) && i();
							  }),
						(a.onerror = function (t) {
							window.console && console.log && console.log(t),
								i();
						}),
						(this.currentAddingScript = a),
						r.insertBefore(a, r.firstChild),
						(this.currentAddingScript = null);
				},
				getCurrentScript: function () {
					if (this.currentAddingScript)
						return this.currentAddingScript;
					var t = this.interactiveScript;
					if (t && 'interactive' == t.readyState) return t;
					for (
						var e,
							n = this.head.getElementsByTagName('script'),
							i = n.length - 1;
						i >= 0;
						i--
					)
						if (((e = n[i]), 'interactive' == e.readyState))
							return (
								(this.interactiveScript = e),
								this.interactiveScript
							);
				}
			},
			x = {},
			T = {
				path: (function () {
					var t = document.getElementsByTagName('script');
					return (
						/^(.+?:\/\/.+?)(?:[\/\?#])/.exec(t[t.length - 1].src),
						RegExp.$1
					);
				})(),
				main: 'index.js'
			},
			A = (T.alias = {}),
			S = {
				META: 10,
				FETCHING: 20,
				FETCHED: 30,
				LOADING: 40,
				LOADED: 50,
				EXECUTING: 60,
				DONE: 70
			},
			N = 0,
			D = /\brequire\(\s*['"](\S*)['"]\s*\)/g,
			C = /\/\.\//g,
			O = /([^:])\/+\//g,
			I = /\/[^\/]+\/\.\.\//,
			j = /^[^:\/]+:\/\//,
			F = /^(?:[a-zA-Z]+?:)?\/\/.+?/,
			L = /\/[^\/]*\.[^\/]*$/,
			G = 0,
			w = {};
		d(l.prototype, {
			onload: function () {
				this.status >= S.LOADED ||
					((this.status = S.LOADED), y.emit(this.uri, this));
			},
			fetch: function () {
				if (this.isAlias) return void this.aliasFetch();
				var t = this;
				this.status < S.FETCHING &&
					((this.status = S.FETCHING),
					G++,
					b.load(this.uri, function () {
						u && ((t.factory = u.factory), (t.deps = u.deps)),
							(u = null),
							(t.status = S.FETCHED),
							G--,
							t.load();
					}));
			},
			aliasFetch: function () {
				if (!(this.status >= S.FETCHING)) {
					var t = this,
						e = 0,
						n = function () {
							(e -= 1) <= 0 &&
								(G++,
								b.load(t.uri, function () {
									G--, t.onload(), l.release();
								}));
						};
					this.status = S.FETCHING;
					for (
						var i, r, a, c = this.deps || [], s = c.length - 1;
						s >= 0;
						s--
					)
						(a = c[s]),
							(r = o(a)),
							(i = l.get(r)),
							i ||
								(i = l.create({
									id: a,
									uri: r
								})),
							i.status < S.LOADED &&
								((e += 1), y.one(r, n), i.fetch());
					0 == e && n();
				}
			},
			load: function () {
				function t() {
					0 == (c -= 1) && e.onload();
				}
				var e = this;
				if (this.status < S.FETCHING) return void this.fetch();
				if (!(this.status <= S.FETCHING || this.status >= S.LOADING)) {
					(this.status = S.LOADING), (w[e.uri] = e);
					for (
						var n,
							i,
							r,
							a = this.deps,
							c = 0,
							s = [],
							u = a.length - 1;
						u >= 0;
						u--
					)
						(r = a[u]),
							(i = o(r, e.uri)),
							(n = l.get(i)),
							n ||
								(n = l.create({
									id: r,
									uri: i
								})),
							n.status < S.LOADED &&
								((c += 1),
								y.one(i, t),
								n.status <= S.FETCHED ? n.fetch() : s.push(n));
					if (0 == c) e.onload();
					else {
						for (u = s.length - 1; u >= 0; u--) s[u].load();
						l.release();
					}
				}
			},
			exec: function () {
				function e(t) {
					return l.require(t, n);
				}
				if (this.status != S.DONE) {
					var n = this.uri;
					if (this.isAlias) {
						var i = this.alias || {};
						if (E(i.exports)) {
							this.exports = t[i.exports];
							for (
								var r = i.exports.split('.'),
									a = t,
									c = 0,
									s = r.length;
								c < s;
								c++
							)
								(this.exports = a[r[c]]), (a = this.exports);
						}
					} else {
						var o = this.factory;
						(this.status = S.EXECUTING), o(e, this.exports, this);
					}
					(this.status = S.DONE),
						delete this.factory,
						delete this.deps;
				}
			}
		}),
			d(l, {
				release: function () {
					if (!(G > 0)) {
						var t, e;
						for (t in w)
							(e = w[t]), e.status == S.LOADING && e.onload();
						w = {};
					}
				},
				get: function (t) {
					return x[t];
				},
				create: function (t) {
					var e,
						n = this.get(t.uri);
					return (
						n
							? ((n.factory = t.factory), (n.deps = t.deps))
							: (t.id &&
									(e = s(t.id)) &&
									(t.deps = e.requires || []),
							  (n = new l(t.uri, t.deps, t.factory)),
							  (n.alias = e),
							  (n.isAlias = !!e),
							  n.factory
									? (n.status = S.FETCHED)
									: (n.status = S.META),
							  (x[n.uri] = n)),
						n
					);
				},
				require: function (t, e) {
					var n = this.get(o(t, e));
					if (!n)
						throw (
							'there is no module named: ' +
							t +
							'(' +
							o(t, e) +
							')'
						);
					return n.status < S.EXECUTING && n.exec(), n.exports;
				}
			}),
			(f.define = function () {
				var t,
					e,
					n,
					i = [].slice.call(arguments);
				switch (i.length) {
					case 3:
						(t = i[0]), (e = i[2]), (n = i[1]);
						break;
					case 2:
						(e = i[1]),
							m(i[0])
								? (n = i[0])
								: ((t = i[0]), (n = a(e.toString())));
						break;
					case 1:
						(e = i[0]), (n = a(e.toString()));
				}
				var r = {
					uri: o(t),
					deps: n,
					factory: e
				};
				if (!r.uri && document.attachEvent) {
					var c = b.getCurrentScript();
					c && (r.uri = c.src);
				}
				r.uri ? l.create(r) : (u = r);
			}),
			(f.use = function () {
				var t,
					e,
					i = [].slice.call(arguments);
				switch (i.length) {
					case 2:
						(t = i[0]), (e = i[1]);
						break;
					case 1:
						(e = i[0]), (t = a(e.toString()));
				}
				var r = {
						uri: n(),
						deps: m(t) ? t : [t],
						factory: e || h
					},
					c = l.create(r);
				return (
					y.one(c.uri, function () {
						c.exec();
					}),
					c.load(),
					f
				);
			}),
			(f.config = function (t) {
				return d(T, t), f;
			}),
			(f.alias = function (t) {
				d(A, t);
			}),
			(f.cache = x),
			(t.cola = f),
			t.define || (t.define = f.define);
	})(this),
	(function (t, e) {
		function n(t) {
			(t = t || {}),
				(this.config = a(t, g)),
				(this.subTree = {
					t: {},
					h: []
				}),
				(this.pubItems = {});
		}
		var i = 1,
			r = Object.prototype.toString,
			a = function (t, e) {
				if (t)
					for (var n in e)
						'undefined' == typeof t[n] && (t[n] = e[n]);
				return t;
			},
			c = function (t) {
				return (t || '') + i++;
			},
			s = function (t) {
				throw new Error(t);
			},
			o = function (t) {
				s('illegalTopic:' + t);
			},
			l = function (t) {
				(!t ||
					!t.length ||
					'[object String]' != r.call(t) ||
					/\*{2}\.\*{2}/.test(t) ||
					/([^\.\*]\*)|(\*[^\.\*])/.test(t) ||
					/(\*\*\.\*)|(\*\.\*\*)/.test(t) ||
					/\*{3}/.test(t) ||
					/\.{2}/.test(t) ||
					'.' == t[0] ||
					'.' == t[t.length - 1]) &&
					o(t);
			},
			u = function (t) {
				var e = /[^a-zA-Z0-9-_\.\*]/.exec(t);
				e && s('illegalCharactor:' + e[1]);
			},
			f = function (t) {
				(!t ||
					!t.length ||
					'[object String]' != r.call(t) ||
					-1 != t.indexOf('*') ||
					'.' == t[0] ||
					/\.{2}/.test(t) ||
					'.' == t[t.length]) &&
					o(t);
			},
			h = function (t, e, n, i) {
				e = void 0 === e ? null : e;
				for (var a, c, s = 0, o = n.length; s < o; s++)
					!(a = n[s]) ||
						(void 0 !== i && a.pubId === i) ||
						((a.pubId = i),
						(c = a.config),
						c && c._topics
							? (function (t, e, n, i) {
									var r = !0;
									(e[n] = i), (t[n] = !0);
									for (var a in t)
										if (!t[a]) {
											r = !1;
											break;
										}
									return r;
							  })(c._topics, c.topics, t, e) &&
							  (!(function (t, e) {
									for (var n in t) t[n] = !1;
							  })(c._topics, c.topics),
							  setTimeout(function () {
									a.h.call(a.scope, t, c.topics, a.data);
							  }, 0))
							: (a.execedTime++,
							  '[object Number]' == r.call(a.config.execTime) &&
									a.execedTime >= a.config.execTime &&
									(n[s] = null),
							  setTimeout(function () {
									a.h.call(a.scope, t, e, a.data);
							  }, 0)));
			},
			d = function (t, e) {
				for (var n = 0, i = t.length; n < i; n++)
					if (t[n].sid == e) {
						t[n] = null;
						break;
					}
			},
			p = function (t, e) {
				return (
					t == e ||
					'**' == e ||
					((e = e.replace(/\.\*\*\./g, '(((\\..+?\\.)*)|\\.)')),
					(e = e.replace(/^\*\*\./, '(.+?\\.)*')),
					(e = e.replace(/\.\*\*$/, '(\\..+?)*')),
					(e = e.replace(/\.\*\./g, '(\\..+?\\.)')),
					(e = e.replace(/^\*\./g, '(.+?\\.)')),
					(e = e.replace(/\.\*$/g, '(\\..+?)')),
					/[^\.|\*]$/.test(e) && (e += '$'),
					new RegExp(e).test(t))
				);
			},
			v = function (t, e) {
				var n = [];
				for (var i in e)
					p(i, t) &&
						n.push({
							topic: i,
							value: e[i]
						});
				return n;
			},
			g = {
				cache: !0
			};
		a(n.prototype, {
			version: '1.0',
			subscribe: function (e, n, i, r, a) {
				l(e), u(e), (i = i || t), (a = a || {});
				var s = c(),
					o = {
						h: n,
						scope: i,
						data: r,
						sid: s,
						execedTime: 0,
						config: a
					},
					f = e.split('.'),
					d = 0,
					p = f.length;
				if (
					((function (t, e, n, i) {
						var r = t[e];
						e == t.length
							? i.h.push(n)
							: (i.t[r] ||
									(i.t[r] = {
										t: {},
										h: []
									}),
							  arguments.callee.call(this, t, ++e, n, i.t[r]));
					})(f, 0, o, this.subTree),
					this.config.cache && a.cache)
				) {
					var g = v(e, this.pubItems);
					for (d = 0, p = g.length; d < p; d++)
						h(g[d].topic, g[d].value, [o]);
				}
				return e + '^' + s;
			},
			publish: function (t, e) {
				f(t), u(t), (this.pubItems[t] = e);
				var n = t.split('.');
				!(function (t, e, n, i, r, a, c) {
					var s = t[e];
					e == t.length
						? h(r, i, c && c.isWildcard ? n.t['**'].h : n.h, a)
						: (n.t['**'] &&
								(n.t['**'].t[s]
									? arguments.callee.call(
											this,
											t,
											e + 1,
											n.t['**'].t[s],
											i,
											r,
											a,
											{
												index: e,
												tree: n
											}
									  )
									: arguments.callee.call(
											this,
											t,
											e + 1,
											n,
											i,
											r,
											a,
											{
												isWildcard: !0
											}
									  )),
						  n.t[s]
								? arguments.callee.call(
										this,
										t,
										e + 1,
										n.t[s],
										i,
										r,
										a
								  )
								: c &&
								  !c.isWildcard &&
								  arguments.callee.call(
										this,
										t,
										++c.index,
										c.tree,
										i,
										r,
										a,
										c
								  ),
						  n.t['*'] &&
								arguments.callee.call(
									this,
									t,
									e + 1,
									n.t['*'],
									i,
									r,
									a
								));
				})(n, 0, this.subTree, e, t, c());
			},
			unsubscribe: function (t) {
				for (
					var e = this, t = t.split(';'), n = 0, i = t.length;
					n < i;
					n++
				)
					!(function (t) {
						var t = t.split('^');
						2 != t.length && s('illegal sid:' + t);
						var n = t[0].split('.'),
							i = t[1];
						!(function (t, e, n, i) {
							var r = t[e];
							e == t.length
								? d(n.h, i)
								: n.t[r] &&
								  arguments.callee.call(
										this,
										t,
										++e,
										n.t[r],
										i
								  );
						})(n, 0, e.subTree, i);
					})(t[n]);
			},
			wait: function (t, e, n, i, a) {
				if ('[object Array]' === r.call(t) && t.length) {
					(a = a || {}), (a.topics = {}), (a._topics = {});
					for (var c, s = [], o = 0, l = t.length; o < l; o++)
						(c = t[o]),
							f(t[o]),
							(a.topics[c] = null),
							(a._topics[c] = !1);
					for (o = 0; o < l; o++)
						s.push(this.subscribe(t[o], e, n, i, a));
					return s.join(';');
				}
			}
		}),
			(t.messagebus = new n()),
			(t.MessageBus = n);
	})(window, undefined);
