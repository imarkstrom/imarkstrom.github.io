;;; Config file --- setup

;;; Code:
(setq backup-directory-alist '(("" . "~/.emacs.d/emacs-backups")))
(setq auto-save-default nil)
(setq scroll-error-top-bottom t)
(setq inhibit-startup-screen 1)
(setq create-lockfiles nil)
(setq compilation-scroll-output 'first-error)

;; Windows performance tweaks
;;
(when (boundp 'w32-pipe-read-delay)
  (setq w32-pipe-read-delay 0))
;; Set the buffer size to 64K on Windows (from the original 4K)
(when (boundp 'w32-pipe-buffer-size)
  (setq irony-server-w32-pipe-buffer-size (* 64 1024)))

(tool-bar-mode -1)
(scroll-bar-mode 0)
(ido-mode t)
(blink-cursor-mode 0)

;; Very global configs defaults
(setq-default
 indent-tabs-mode nil
 tab-width 4
 c-basic-offset 4
 c-default-style "stroustrup"
 ;;c-toggle-auto-newline 1
 c-toggle-hungry-state 1
 )


;; Very global hooks
(add-hook 'before-save-hook 'delete-trailing-whitespace)

;; the package manager
(require 'package)
(setq
 package-archives '(
                    ("melpa" . "https://melpa.org/packages/")
                    ("melpa-stable" . "https://stable.melpa.org/packages/")
                    ("gnu" . "https://elpa.gnu.org/packages/")
		    )
 )
(package-initialize)

;; Setup of use-package. We use use-package. And, if this fails, we have
;; to install use-package ourselves, and then the rest of this config
;; will run through. :)
(unless (package-installed-p 'use-package)
  (package-refresh-contents)
  (package-install 'use-package))

;; A bit more interactive stuff.
;; All the useability. Without it, were screwed...
(use-package evil
  :ensure t)
(evil-mode 1)

;(use-package linum-relative
;  :ensure t)
;;(linum-relative-global-mode)
;(setq linum-relative-current-symbol "")

;; Gief a user line that dont look like crap.
(use-package powerline
  :ensure t)
(powerline-center-evil-theme)

;; Choose between triangle, arrow, wave, or what ever specified in the config..
;; Me no remember really... :)
(setq powerline-default-separator 'wave)

(use-package evil-surround
  :ensure t)
(global-evil-surround-mode t)

(use-package yasnippet
  :ensure t)

;(use-package evil-visual-mark-mode
;  :ensure t)
;; Not used as a standard... buggy?
;(advice-add 'evil-delete-marks :after
;            (lambda (&rest args)
;              (evil-visual-mark-render)))
;(evil-visual-mark-mode t)


;;;;;;;;; ORG_STUFF ;;;;;;;;;;;

; Some nice additions to org for us evil people.
(use-package org-evil
  :ensure t)

;; Make org look splendid. Bullets eye... and so on.
(use-package org-bullets
  :ensure t)

;; Make bibtex work a treat with stuff.
;; This is actually useful, but only for latex-exports.
;(use-package org-ref
; :ensure t)
;(require 'org-ref)
;(setq org-ref-show-broken-links nil)
;;;Export stuff with bibtex and headers up to date.
;(setq org-latex-pdf-process
;     '("pdflatex -interaction nonstopmode -output-directory %o %f"
;	"bibtex %b"
;	"pdflatex -interaction nonstopmode -output-directory %o %f"
;	"pdflatex -interaction nonstopmode -output-directory %o %f"))

;; Allow org to set variables inside of document. Mostly used for
;; org-ref to point out the bibtex file per project
;(setq org-export-allow-bind-keywords t)

;(use-package ispell
;  :ensure t)

;; find aspell and hunspell automatically
;(cond
; ;; try hunspell at first
;  ;; if hunspell does NOT exist, use aspell
; ((executable-find "hunspell")
;  (setq ispell-program-name "hunspell")
;  (setq ispell-local-dictionary "en_US")
;  (setq ispell-local-dictionary-alist
;        ;; Please note the list `("-d" "en_US")` contains ACTUAL parameters passed to hunspell
;        ;; You could use `("-d" "en_US,en_US-med")` to check with multiple dictionaries
;        '(("en_US" "[[:alpha:]]" "[^[:alpha:]]" "[']" nil ("-d" "en_US") nil utf-8)
;          )))

; ((executable-find "aspell")
;  (setq ispell-program-name "aspell")
;  ;; Please note ispell-extra-args contains ACTUAL parameters passed to aspell
;  (setq ispell-extra-args '("--sug-mode=ultra" "--lang=en_US"))))
;;; To keep org not disable row splitting and some org-hooks...


;(use-package langtool
;  :ensure t)
;(require 'langtool)
;(setq langtool-language-tool-jar "/usr/local/opt/languagetool/libexec/languagetool-commandline.jar")




;; (use-package poet-theme
;;   :ensure t)
;(use-package olivetti
;  :ensure t)

(defun my-org-mode-hook ()
  "Stuff for org mode setup."
  (ispell-minor-mode)
  (toggle-truncate-lines nil)
  (org-bullets-mode t)
  (toggle-word-wrap t)
  (flyspell-mode)
;  (olivetti-mode 1)
;  (olivetti-set-width 120)
  (blink-cursor-mode 0)
  (variable-pitch-mode 0)
 ; (load-theme 'poet)
  )

(add-hook 'org-mode-hook 'my-org-mode-hook)

(with-eval-after-load 'ox-latex
  (add-to-list 'org-latex-classes
               '("kththesis"
                 "\\documentclass{kththesis}"
                 ("\\chapter{%s}" . "\\chapter{%s}")
                 ("\\section{%s}" . "\\section{%s}")
                 ("\\subsection{%s}" . "\\subsection{%s}")
                 ("\\subsubsection{%s}" . "\\subsubsection{%s}")
                 ("\\paragraph{%s}" . "\\paragraph{%s}")
                 ("\\subparagraph{%s}" . "\\subparagraph{%s}")
                 )))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;;;;;;;;;;;;;GIT;;;;;;;;;;;;;;;

;; The best git. Period.
(use-package magit
  :ensure t)
;;Custom for opening magit in selected buffer, most often.
(setq magit-display-buffer-function
      (lambda (buffer)
        (display-buffer
         buffer
         (cond ((and (derived-mode-p 'magit-mode)
                     (eq (with-current-buffer buffer major-mode)
                         'magit-status-mode))
                nil)
               ((memq (with-current-buffer buffer major-mode)
                      '(magit-process-mode
                        magit-revision-mode
                        magit-diff-mode
                        magit-stash-mode))
                nil)
               (t
                '(display-buffer-same-window))))))

(use-package paredit
  :ensure t)

;;(setenv "PKG_CONFIG_PATH" (concat "/usr/local/Cellar/zlib/1.2.8/lib/pkgconfig:/usr/local/lib/pkgconfig:/opt/X11/lib/pkgconfig" (getenv "PKG_CONFIG_PATH")))
;; (use-package pdf-tools
;;   :ensure t)
;; (pdf-tools-install)

;; CMAKE STHUFF
;(use-package cmake-ide
;  :ensure t)

;; Initialize syntax checking.
(use-package flycheck
  :ensure t)

;;Company initialization stuff
(use-package company
  :ensure t)
(global-company-mode)

;; Make symbol lookups work nice. Part 2.
;(use-package rtags
;  :ensure t)

;(use-package company-rtags
;  :ensure t)

;(use-package flycheck-rtags
;  :ensure t)

(use-package irony
  :ensure t)

(add-hook 'c++-mode-hook 'irony-mode)
(add-hook 'irony-mode-hook 'irony-cdb-autosetup-compile-options)



(defun my-select-checker()
  "Select checker for flychecks checker."
  (require 'flycheck)
  (flycheck-select-checker 'rtags)
  (setq-local flycheck-highlighting-mode nil)
  (setq-local flycheck-check-syntax-automatically nil)
  (global-flycheck-mode)
  )


(defun cmake-keybindings-hook ()
  (local-set-key (kbd "C-\, C-b m") 'cmake-ide-compile)
  (local-set-key (kbd "C-\, C-b c") 'compile)
  (local-set-key (kbd "C-\, C-b l") 'compile-goto-error))

(defun configure-company-vars ()
  (setq company-dabbrev-downcase 0)
  (setq company-idle-delay 0.3)
  (setq company-minimum-prefix-length 1)
  (setq company-selection-wrap-around t))


(use-package company-irony
  :ensure t)
;(push 'company-irony company-backends)

(configure-company-vars)

(defun my-c++-mode-hook()
  "Setup for all rtags related stuff."
  (setq c-default-style "stroustrup")
  ;; Keys for c++ and rtags lookups
  (require 'company)
  ;(setq company-backends (delete 'company-semantic company-backends))
  ;(add-to-list 'company-backends 'company-rtags)
  (setq rtags-autostart-diagnostics t)
  (rtags-diagnostics)
  (setq rtags-completions-enabled t)
  (push 'company-rtags company-backends)
  (global-company-mode)
  (configure-company-vars)
  (cmake-keybindings-hook)

  (rtags-start-process-unless-running)
  (local-set-key (kbd "C-\, C-l") 'rtags-find-symbol-at-point)
  (local-set-key (kbd "C-\, C-r") 'rtags-find-references-at-point)
  (global-unset-key (kbd "C-<tab>"))
  (define-key c-mode-base-map (kbd "<C-tab>") (function company-complete))

  (my-select-checker))



;; C++ syntax completion!
;;(use-package company-irony
;;  :ensure t)
;;(defun my-irony-mode-hook()
;;  (company-irony-setup-begin-commands)
;;  (setq company-backends (delete 'company-semantic company-backends))
;;  (define-key irony-mode-map [remap completion-at-point]
;;    'irony-completion-at-point-async)
;;  (define-key irony-mode-map [remap complete-symbol]
;;    'irony-completion-at-point-async))
;;
;;(add-hook 'irony-mode-hook 'my-c++-mode-hook)
;;(add-hook 'irony-mode-hook 'irony-cdb-autosetup-compile-options)

;(add-hook 'c++-mode-hook 'my-c++-mode-hook)
;(add-hook 'c-mode-hook 'my-c++-mode-hook)

;;;;; OpenGL ;;;;;;

(add-to-list 'auto-mode-alist '("\\.glsl\\'" . c-mode))
(add-to-list 'auto-mode-alist '("\\.vert\\'" . c-mode))
(add-to-list 'auto-mode-alist '("\\.frag\\'" . c-mode))
(add-to-list 'auto-mode-alist '("\\.geom\\'" . c-mode))
(add-to-list 'auto-mode-alist '("\\.cl\\'" . c-mode))

(use-package web-mode
  :ensure t)
(add-to-list 'auto-mode-alist '("\\.js\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.css\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.erb\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.html\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.phtml\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.djhtml\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.[agj]sp\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.as[cp]x\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.mustache\\'" . web-mode))
(add-to-list 'auto-mode-alist '("\\.tpl\\.php\\'" . web-mode))


;; Python development!
;(use-package elpy
;  :ensure t)
;(setq elpy-rpc-python-command "python3")
;(setq elpy-syntax-check-command "~/Library/Python/3.6/bin/flake8")
;(setq python-check-command "flake8")
;(elpy-enable)


;;;;;;; THEMES ;;;;;;;
;; (use-package sublime-themes
;;   :ensure t)

;; A nice theme...
;; (use-package solarized-theme
;;   :ensure t)

;;;;;;;;;;;;;;;;;;;;;;


;;Saved Macros
(fset 'tab-line
   (lambda (&optional arg) "Keyboard macro." (interactive "p") (kmacro-exec-ring-item (quote ([105 tab escape 48 106] 0 "%d")) arg)))

;; Global keybindings
(global-set-key (kbd "C-\, C-c") 'comment-line)
(global-set-key (kbd "C-\, C-r") 'comment-region)
(global-set-key (kbd "C-\, C-t") 'tab-line)

(provide '.emacs)
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-enabled-themes (quote (tango-dark)))
 '(package-selected-packages
   (quote
    (company-irony web-mode company flycheck paredit magit org-bullets org-evil yasnippet evil-surround powerline evil use-package))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
