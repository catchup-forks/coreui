define(['jquery', 'cui', 'guid', 'css!modal'], function ($, cui, guid) {
    /////////////
    // Globals //
    /////////////

    var NAMESPACE = 'modal';

    var CLASSES = {
        modal: 'cui-' + NAMESPACE,
        modalContents: 'cui-' + NAMESPACE + '-content',
        modalVisibility: 'cui-' + NAMESPACE + '-inivisible',
        overlay: 'cui-' + NAMESPACE + '-overlay',
        modalButton: 'cui-' + NAMESPACE + '-hide',
    };

    var EVENT_NAMES = {
        show:   'show.cui.' + NAMESPACE,
        shown:  'shown.cui.' + NAMESPACE,
        hide:   'hide.cui.' + NAMESPACE,
        hidden: 'hidden.cui.' + NAMESPACE,
    };

    var modals = {}; // List of existing modals
    var $window = null; // jQuery cache

    /////////////
    // Private //
    /////////////

    var _priv = {}; // Namespace for private methods

    // Function is used to create the modal
    _priv.buildModal = function _buildModal (modal) {
        // Start by using fastdom to check to see if the elements need to be added
        fastdom.measure(function _buildModal_fastdom1 () {
            // Check to see if the modal/overlay already exist on the screen
            var addOverlay = false;
            var addModal = false;

            // Check to see if we are event adding a modal overlay first
            if (modal.$overlay) {
                // Check the dom for an already created modal overlay
                if (!document.body.contains(modal.$overlay[0])) {
                    addOverlay = true;
                }
            }

            // check the dom for an already create modal
            if (!document.body.contains(modal.$self[0])) {
                addModal = true;
            }

            // Only add contents if we need too.
            if (addModal || addOverlay) {
                fastdom.mutate(function _buildModal_fastdom2 () {
                    // Add the missing overlay
                    if (addOverlay) {
                        document.body.appendChild(modal.$overlay[0]);
                    }

                    // Add the missing modal
                    if (addModal) {
                        document.body.appendChild(modal.$self[0]);
                    }

                    fastdom.measure(function _buildModal_fastdom3 () {
                        // Hook to execute a script after the modal has been created
                        if (typeof modal.config.onCreate === 'function') {
                            modal.config.onCreate(modal);
                        }

                        // We are good to display the modal.
                        if (modal.config.autoOpen) {
                            _priv.showModal(modal);
                        }
                    });
                });
            }
        });
    };

    // Function that displays a modal.
    _priv.showModal = function _showModal (modal) {
        // Check to see if a pre-display function needs to run i.e. table setup.
        if (typeof modal.config.beforeShowFunc === 'function') {
            modal.config.beforeShowFunc(modal);
        }

        if (modal.$overlay) {
            modal.$overlay.css({display: 'block'});
        }

        fastdom.mutate(function _showModal_fastdom1 () {
            modal.$self.css({'z-index': 1100});

            if (modal.config.alwaysCenter) {
                fastdom.mutate(function _showModal_fastdom2 () {
                    _priv.center(modal);

                    fastdom.mutate(function _showModal_fastdom3 () {
                        modal.$self
                            .css({'visibility': 'visible'});

                        // Use a delay so the page doesn't scroll down (why does that happen? CP 5/2/16)
                        setTimeout(function _showModal_setTimeout3 () {
                            if (modal.config.focusOnShow) {
                                modal.config.focusOnShow.focus();
                            }
                            else {
                                modal.$self.focus();
                            }
                        }, 100);

                        modal.$self.trigger(EVENT_NAMES.shown);
                        $window.trigger(EVENT_NAMES.shown);
                    });
                });
            }
            else {
                fastdom.mutate(function _showModal_fastdom4 () {
                    modal.$self
                        .css({'visibility': 'visible'});

                    // Use a delay so the page doesn't scroll down (why does that happen? CP 5/2/16)
                    setTimeout(function _showModal_setTimeout4 () {
                        if (modal.config.focusOnShow) {
                            modal.config.focusOnShow.focus();
                        }
                        else {
                            modal.$self.focus();
                        }
                    }, 100);
                });
            }
        });

        modal.$self.trigger(EVENT_NAMES.show);
        $window.trigger(EVENT_NAMES.show);

        // Hide on escape key press
        if (modal.config.hideOnEscape) {
            $window.on('keyup.cui.modal.escape', {modal: modal}, _events.hideOnEscape);
        }

        $window.on('resize', {modal: modal}, _events.resize);
    };

    // Function will hide the passes modal.
    _priv.hideModal = function _hideModal (modal) {
        modal.$self.trigger(EVENT_NAMES.hide);
        $window.trigger(EVENT_NAMES.hide);

        // Check to see if we were suppose to destroy instead of hide.
        if (modal.config.hideDestroy) {
            _priv.destroyModal(modal, true);
        }
        else {
            if (typeof modal.config.onHide === 'function') {
                modal.config.onHide(modal);
            }

            fastdom.mutate(function _hideModal_fastdom () {
                if (modal.$overlay) {
                    modal.$overlay.css({display: 'none'});
                }

                modal.$self
                    .css({
                        'z-index': -1,
                        'visibility': 'hidden',
                    });

                $window.off('keyup.cui.modal.escape');
                $window.off('resize', _events.resize);

                modal.$self.trigger(EVENT_NAMES.hidden);
                $window.trigger(EVENT_NAMES.hidden);
            });
        }
    };

    // Function that will completely remove the modal elements from the DOM
    _priv.destroyModal = function _destroyModal (modal, doNotTriggerEvents) {
        if (typeof modal.config.onHide === 'function') {
            modal.config.onHide(modal);
        }

        fastdom.mutate(function _destroyModal_fastdom () {
            if (!doNotTriggerEvents) {
                modal.$self
                    .trigger(EVENT_NAMES.hide)
                    .trigger(EVENT_NAMES.hidden);
            }

            modal.$self.remove();

            if (modal.$overlay) {
                modal.$overlay.remove();
            }

            if (!doNotTriggerEvents) {
                $window
                    .trigger(EVENT_NAMES.hide)
                    .trigger(EVENT_NAMES.hidden);
            }
        });
    };

    /**
     * Centers a modal on the viewport
     *
     * @param   {Object}  modal  Modal instance
     */
    _priv.center = function _center (modal) {
        fastdom.measure(function () {
            var css = {
                top: (($window.height() - modal.$self.outerHeight()) / 2),
                left: (($window.width() - modal.$self.outerWidth()) / 2),
            };

            fastdom.mutate(function _modal_center_fastdom () {
                modal.$self.css(css);
            });
        });
    };

    ////////////
    // Events //
    ////////////

    var _events = {};

    /**
     * Handles window resizing
     *
     * @param   {Event}  evt  Window resize event
     */
    _events.resize = function _resize (evt) {
        var modal = evt.data.modal;

        if (modal.config.eventHandlers.resize) {
            modal.config.eventHandlers.resize(evt, modal);
        }
        else {
            _priv.center(evt.data.modal);
        }
    };

    /**
     * Hides a modal when the Escape key is pressed
     *
     * @param   {Event}  evt  Keyup event
     */
    _events.hideOnEscape = function _hideOnEscape (evt) {
        var modal;
        var focusElem;

        if (evt.keyCode === 27) {
            modal = evt.data.modal;

            _priv.hideModal(modal);

            // Set focus to a specific element
            if (modal.config.focusOnHide) {
                focusElem = modal.config.focusOnHide;

                // Extract the actual DOM element from the jQuery collection
                if (focusElem instanceof $) {
                    focusElem = focusElem.get(0);
                }

                setTimeout(function _hideOnEscape_setTimeout () {
                    focusElem.focus();
                }, 100);
            }
        }
    };

    ////////////
    // Public //
    ////////////

    var Modal = function (elem, options) {
        if (elem instanceof Node) {
            // Store the element upon which the component was called
            this.elem = elem;
            // Create a jQuery version of the element
            // this.$self = $(elem);

            this.$button = $(elem);

            // This next line takes advantage of HTML5 data attributes
            // to support customization of the plugin on a per-element
            // basis. For example,
            // <div class="item" data-modal-options="{'message':'Goodbye World!'}"></div>
            this.metadata = this.$button.data('modal-options');
        }
        else {
            this.metadata = {};

            this.$self = false;

            options = elem;
        }

        // Store the options
        this.options = options;
    };

    Modal.prototype = {};

    Modal.prototype.default = {
        html: '',
        display: null,
        overlay: true,
        autoOpen: false,
        hideOnEscape: true,
        alwaysCenter: true,
        focusOnShow: false,
        eventHandlers: {
            resize: false
        },
        focusOnHide: null,
        onCreate: null,
    };

    // Init function
    Modal.prototype.init = function () {
        // Create the modal reference object
        var modal = this;

        if (!$window) {
            $window = $(window);
        }

        // Extend the config options with the defaults
        if (typeof this.options === 'string') {
            modal.config = $.extend(true, {}, this.default);

            modal.config.html = this.options;
        }
        else {
            modal.config = $.extend(true, {}, this.default, this.options);
        }

        // Create a unique ID for the modal
        modal.config.id = guid();

        // Check to see if a source element was provided
        // If not build our own
        if (!modal.$self) {
            // Create the modal
            modal.$self = $('<div/>', {
                                'id': modal.config.id,
                                'class': CLASSES.modal,
                                'tabindex': 1,
                            });

            modal.$self
                .append(
                    $('<button/>', {
                            'class': CLASSES.modalButton,
                        })
                        .text('Close Modal')
                        .on('click', function (evt) {
                            evt.preventDefault();

                            _priv.hideModal(modal);
                        })
                );

            // Create the container
            modal.$container = $('<div/>', {
                                    'class': CLASSES.modalContents,
                                });

            // Add the container to the modal
            modal.$self.append(modal.$container);

            // Check to see if the instance requested an overlay
            if (modal.config.overlay) {
                modal.$overlay = $('<div/>', {
                                        'id': 'overlay-' + modal.config.id,
                                        'class': CLASSES.overlay,
                                        'data-modal': modal.config.id,
                                    })
                                    .on('click', function (evt) {
                                        evt.preventDefault();
                                        _priv.hideModal(modal);
                                    });

                if (modal.config.overlay.className) {
                    modal.$overlay.addClass(modal.config.overlay.className);
                }
            }
            else {
                modal.$overlay = false;
            }

            // Now add the modals contents (contents should be pre-formatted);
            modal.$container.append(modal.config.html);

        }
        // To do: Take an existing container created by something else, wrapping it and turning it into a modal
        // else { }

        // ===================
        // MODAL DISPLAY ITEMS
        // ===================

        // check for custom display properties
        if (modal.config.display) {
            // Check for custom modal class.
            if (modal.config.display.className) {
                modal.$self.addClass(modal.config.display.className);
            }

            // Check to see if there are size value
            if (modal.config.display.width || modal.config.display.height) {
                var css = {};

                // Width
                if (modal.config.display.width) {
                    css.width = modal.config.display.width;
                }

                // Height
                if (modal.config.display.height) {
                    css.height = modal.config.display.height;
                }

                // Apply custom size
                modal.$self.css(css);
            }

            // Check to see if there is custom inline CSS
            if (modal.config.display.css) {
                modal.$self.css(modal.config.display.css);
            }
        }

        // =====================
        // OVERLAY DISPLAY ITEMS
        // =====================

        if (modal.config.overlay && typeof modal.config.overlay === 'object' && !isNaN(modal.config.overlay.opacity)) {
            modal.$overlay.css({'opacity': modal.config.overlay.opacity});
        }

        // Build the modal
        _priv.buildModal(modal);

        if (modal.$button) {
            modal.$button.on('click.modal.' + modal.config.id, function (evt) {
                _priv.showModal(modal);
            }.bind(modal));
        }

        return modal;
    };

    // Public function to hide a modal
    Modal.prototype.hide = function _hide () {
        _priv.hideModal(this);
    };

    // Public function to show a modal
    Modal.prototype.show = function _show () {
        _priv.showModal(this);
    };

    Modal.prototype.destroy = function _destroy () {
        _priv.destroyModal(this);
    };

    Modal.prototype.center = function _center () {
        _priv.center(this);
    };

    // Set the version number
    Modal.version = '2.0.5';

    // Define jQuery plugin with a source element
    $.fn.modal = function (options) {
        return this.each(function () {
            new Modal(this, options).init();
        });
    };

    // Create from scratch.
    $.modal = function (options) {
        return new Modal(options).init();
    };
});
