<?php 
declare(strict_types=1);

require './vendor/autoload.php';

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class ApiTest extends TestCase
{
    public function get_api($url, $context): array {
        $json = file_get_contents($url, false, stream_context_create($context));
        return json_decode($json);
    }

    public function testLaLiga(): void
    {
        $url = 'http://localhost:81/redirect.php';

        $context = array(
            'http' => array(
                'method'  => 'POST',
                'header'  => implode("\r\n", array('Content-Type: application/x-www-form-urlencoded',)),
                'content' => http_build_query([
                    'url' => 'https://www.espn.com/soccer/standings/_/league/esp.1',
                    'xpath_of_table' => '/html/body/div[1]/div/div/div/main/div[3]/div/div/section/div/section/section/div[1]/div/div[2]/div/div[2]/table',
                    'column_numbers_to_scrape' => [4, 5, 6],
                    'titles' => ["L", "F", "A"],
                    'rows' => 5,
                    'xpath_of_a' => 'null',
                    'xpaths_to_scrape_in_a_new_page' => null,
                    'parameter' => 'null',
                    'pages' => 1,
                    '$number_of_hrefs' => 0,
                ])
            )
        );

        $api_data = $this->get_api($url, $context);

        // title row + the number of rows
        $this->assertSame(count($api_data), 6);
    }

    public function testYahoo(): void
    {
        $url = 'http://localhost:81/redirect.php';

        $context = array(
            'http' => array(
                'method'  => 'POST',
                'header'  => implode("\r\n", array('Content-Type: application/x-www-form-urlencoded',)),
                'content' => http_build_query([
                    'url' => 'https://finance.yahoo.co.jp/stocks/ranking/up?market=all&term=daily&page=1',
                    'xpath_of_table' => '/html/body/div/div[2]/main/div/div[2]/div[1]/section/div/div[3]/div/table',
                    'column_numbers_to_scrape' => [1],
                    'titles' => ["name", "highest price", "lowest price"],
                    'rows' => 10,
                    'xpath_of_a' => '/html/body/div/div[2]/main/div/div[2]/div[1]/section/div/div[3]/div/table/tbody/tr[1]/td[1]/a',
                    'xpaths_to_scrape_in_a_new_page' => [
                        "/html/body/div/div[2]/main/div/div[2]/div[1]/div[2]/div[2]/section[1]/div/ul/li[3]/dl/dd/span[1]/span/span", 
                        "/html/body/div/div[2]/main/div/div[2]/div[1]/div[2]/div[2]/section[1]/div/ul/li[4]/dl/dd/span[1]/span/span"
                    ],
                    'parameter' => 'page',
                    'pages' => 3,
                    '$number_of_hrefs' => 30,
                ])
            )
        );

        $api_data = $this->get_api($url, $context);
        
        // title row + the number of rows * the number of pages
        $this->assertSame(count($api_data), 31);
    }
}

