# AWS logo

`aws-logo.svg` is the Amazon Web Services wordmark and smile, authored by Amazon.com, Inc. The base SVG was downloaded on 22 October 2026 from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Amazon_Web_Services_Logo.svg) ([original SVG](https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg)).

The source lists Apache License 2.0; its text is included in `public/licenses/aws-logo-Apache-2.0.txt`, along with attribution in `aws-logo-NOTICE.txt`. Vite copies these files into the production build. Amazon Web Services and its logo are trademarks of Amazon.com, Inc. or its affiliates. See [AWS trademark guidelines](https://aws.amazon.com/trademark-guidelines/).

The current presentation uses white fills on a transparent background, retaining the original paths and aspect ratio. This follows the one-color white presentation for dark backgrounds illustrated in the [AWS Partner Creative and Messaging Guide, page 43](https://pages.awscloud.com/rs/112-TZM-766/images/AWS%20Partner%20Creative%20and%20Messaging%20Guide_January_2022_v1.pdf). The color adaptation was made on 22 October 2026; no geometry was changed. There is no white backing plate, CSS filter or logo animation. Vite imports and bundles it locally, including when deployed under a GitHub Pages repository path; the browser does not load it from a third party.
