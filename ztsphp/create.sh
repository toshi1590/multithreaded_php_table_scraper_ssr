{
  echo "<?php"
  echo "\$url = '$1';"
  echo "\$xpath_of_table = '$2';"
  echo "\$column_numbers_to_scrape = $3;"
  echo "\$titles = $4;"
  echo "\$rows = $5;"
  echo "\$xpath_of_a = '$6';"
  echo "\$xpaths_to_scrape_in_a_new_page = $7;"
  echo "\$parameter = '$8';"
  echo "\$pages = $9;"
  echo "\$urls = [];"
  echo "\$html = file_get_contents(\$url);"
  echo "\$dom = new DOMDocument();"
  echo "@\$dom->loadHTML(\$html);"
  echo "\$xpath = new DOMXPath(\$dom);"
  echo "\$data = [];"
  echo "\$hrefs = [];"
  echo "array_push(\$data, \$titles);"
  echo ""
  echo "if (\$parameter != 'null' && \$pages != 1) {"
  echo "  if (preg_match(\"/\$parameter=[0-9]+/\", \$url)) {"
  echo "    for (\$i = 1; \$i <= \$pages; \$i++) {"
  echo "      array_push(\$urls, preg_replace(\"/\$parameter=[0-9]+/\", \"\${parameter}=\$i\", \$url));"
  echo "    }"
  echo "  } else {"
  echo "    exit('matching error');"
  echo "  }"
  echo "} else {"
  echo "  \$pages = 1;"
  echo "  array_push(\$urls, \$url);"
  echo "}"
  echo ""
  echo "for (\$i = 1; \$i <= \$pages; \$i++) {"
  echo "  \${'runtime'.\$i} = new \parallel\Runtime();"
  echo "}"
  echo ""
} > scraping.php

for i in `seq $9`
do
  {
    echo "\$future${i} = \$runtime${i}->run(function(\$url, \$xpath_of_table, \$column_numbers_to_scrape, \$rows, \$xpath_of_a){"
    echo "  \$html = file_get_contents(\$url);"
    echo "  \$dom = new DOMDocument();"
    echo "  @\$dom->loadHTML(\$html);"
    echo "  \$xpath = new DOMXPath(\$dom);"
    echo "  \$data = [];"
    echo "  \$hrefs = [];"
    echo "  \$data_hrefs = [];"
    echo ""
    echo "  for (\$i = 1; \$i <= \$rows; \$i++) {"
    echo "    try {"
    echo "      \$tr_tds = [];"
    echo "      "
    echo "      for (\$j = 0; \$j < count(\$column_numbers_to_scrape); \$j++) {"
    echo "        if (\$xpath->query(\$xpath_of_table . \"/tbody/tr[\$i]/td[\$column_numbers_to_scrape[\$j]]\")->item(0) == null) {"
    echo "          continue 2;"
    echo "        } else {"
    echo "          array_push(\$tr_tds, \$xpath->query(\$xpath_of_table . \"/tbody/tr[\$i]/td[\$column_numbers_to_scrape[\$j]]\")->item(0)->nodeValue);"
    echo "        }"
    echo "      }"
    echo ""
    echo "      array_push(\$data, \$tr_tds);"
    echo ""
    echo "      if (\$xpath_of_a != 'null') {"
    echo "        \$preg_xpath_of_a = preg_replace(\"/tr\[[0-9]+\]/\", \"tr[\$i]\", \$xpath_of_a);"
    echo "        \$a = \$xpath->query(\$preg_xpath_of_a)->item(0);"
    echo "        \$href = \$a->getAttribute('href');"
    echo "        array_push(\$hrefs, \$href);"
    echo "      }"
    echo "    } catch (Throwable \$t) {"
    echo "      continue;"
    echo "    } catch (Exception \$e) {"
    echo "      continue;"
    echo "    }"
    echo "  }"
    echo ""
    echo "  array_push(\$data_hrefs, \$data);"
    echo "  array_push(\$data_hrefs, \$hrefs);"
    echo ""
    echo "  return \$data_hrefs;"
    echo "}, array(\$urls[$(echo $(($i - 1)))], \$xpath_of_table, \$column_numbers_to_scrape, \$rows, \$xpath_of_a));"
    echo ""
  } >> scraping.php
done

{
  echo "for (\$i = 1; \$i <= \$pages; \$i++) {"
  echo "  \$data = array_merge(\$data, \${'future'.\$i}->value()[0]);"
  echo "  \$hrefs = array_merge(\$hrefs, \${'future'.\$i}->value()[1]);"
  echo "}"
  echo ""
} >> scraping.php


if [ ${10} -gt 0 ]; then
  {
    echo "for (\$i = 1; \$i <= count(\$hrefs); \$i++) {"
    echo "  \${'href_runtime'.\$i} = new \parallel\Runtime();"
    echo "}"
    echo ""
  } >> scraping.php
fi

for i in `seq ${10}`
do
  {
    echo "\$href_future${i} = \$href_runtime${i}->run(function(\$href, \$xpaths_to_scrape_in_a_new_page){"
    echo "  \$html = file_get_contents(\$href);"
    echo "  \$dom = new DOMDocument();"
    echo "  @\$dom->loadHTML(\$html);"
    echo "  \$xpath = new DOMXPath(\$dom);"
    echo "  \$data = [];"
    echo ""
    echo "  for (\$i = 0; \$i < count(\$xpaths_to_scrape_in_a_new_page); \$i++) {"
    echo "    \$value = \$xpath->query(\$xpaths_to_scrape_in_a_new_page[\$i])->item(0)->nodeValue;"
    echo "    array_push(\$data, \$value);"
    echo "  }"
    echo ""
    echo "  return \$data;"
    echo "}, array(\$hrefs[$(echo $(($i - 1)))], \$xpaths_to_scrape_in_a_new_page));"
    echo ""
  } >> scraping.php
done

if [ ${10} -gt 0 ]; then
  {
    echo "for (\$i = 1; \$i < count(\$data); \$i++) {"
    echo "  for (\$j = 0; \$j < count(\${'href_future'.\$i}->value()); \$j++) {"
    echo "    array_push(\$data[\$i], \${'href_future'.\$i}->value()[\$j]);"
    echo "  }"
    echo "}"
    echo ""
  } >> scraping.php
fi

{
  echo "for (\$i = 0; \$i < count(\$data); \$i++) {"
  echo "  if (\$i == 0) {"
  echo "    array_unshift(\$data[\$i], 'id');"
  echo "  } else {"
  echo "    array_unshift(\$data[\$i], \$i);"
  echo "  }"
  echo "}"
  echo ""
  echo "echo json_encode(\$data, JSON_UNESCAPED_UNICODE);"
  echo "?>"
  echo ""
} >> scraping.php


