# Styling documentation

## Breakpoint mixins
A few mixins have been added for easier breakpoint styling. They can be found in `_breakpoints.scss`.

The mixins use relative names for breakpoints, some are already defined (mobile, tablet, tablet-up, desktop), but feel free to add your own or change pixel limits for the existing ones. The configuration is stored in a few variables and a map at the beginning of `_breakpoints.scss`.

### respond-to
This mixin will allow you to write styling for a specific breakpoint without manually writing a media query and repeating selectors.
```scss
.member {
  .title {
    font-size: 18px;
    @include respond-to(mobile) {
      font-size: 14px;
    };
  }
}
```
Above code will be compiled to the following:
```css
.member .title {
  font-size: 18px;
}

@media (max-width: 480px) {
  .member .title {
    font-size: 14px;
  }
}
```

### show-for
This mixin will help you show/hide elements on different breakpoints.
```scss
.member {
  @include show-for(desktop, flex);
}
```
Above code will be compiled to the following:
```css
.member {
  display: none;
}

@media (min-width: 481px) and (max-width: 1024px) {
  .member {
    display: flex;
  }
}
```
The second parameter (display type) is optional, if not provided, if will default to `block`.
