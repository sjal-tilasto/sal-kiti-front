# Changelog
## 1.2.0 - 2022-07-09
Required backend version: 1.2+

### Changes
- Add support for statistic links
- Add athlete information check
- Add Pelias import
- Add new result sort keys
- Check case-insensitive organization abbreviations in import
- Warn about missing licence when importing results
- Update package versions
- Style changes to support new prettier defaults

## 1.1.0 - 2021-01-31

### Changes
- Added support for multiline partial results in SIUS data
- Fixed category value in SIUS import form
- Changed media results to require logged on user, not edit permissions
- Fixed year depending tests

## 1.0.0 - 2020-11-16
Required backend version: 1.0+

### Changes
- Added support for text based partial results
- Added custom ordering for silhouette sport
- Fixed default value for group results
- Changed file import to check only extensions
- Check for missing headers in file import
- Improved errors messages
- Updated versions of required packages

## 0.3.0 - 2020-08-14
Required backend version: 0.4+

### Changes
- Refactored API shared API calls to use mixin
- Added missing translations
- Added competition type information page
- Improved error messages for different failures

## 0.2.0 - 2020-08-11
Required backend version: 0.3+

### Changes
- Added missing result info to result details
- Fixed use of name from result object instead of name from athlete object
- Updated dependencies
- Added saving locale and edit mode to local storage
- Result import updates
  - Fixed numeric category codes
  - Added dry run option
  - Added wtype option for Mustaruuti results
  - Added improved Excel import headers
  - Added improved team member information
  - Added nested partial results
  - Fixed importing empty result
- Various UI improvements and fixes
- Changed group results primarily by elimination_category
- Added empty results columns filtering in results list
- Ignore DNS/DNF/DSQ in final result group
- Fixed media results
- Limit external and historical organizations in views
- Added travis config
- Updated tests

## 0.1.0 - 2020-02-17
Initial public version