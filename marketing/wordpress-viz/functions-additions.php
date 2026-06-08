<?php
/* ============================================================================
 * RePrime Visualization Suite — functions.php additions
 * ----------------------------------------------------------------------------
 * Paste this block at the END of your (child) theme's functions.php.
 * It:
 *   1. Enqueues the shared CSS + all CDN libraries + the 6 viz scripts,
 *      ONLY on the homepage, ALL with `defer` so nothing blocks page load.
 *   2. Registers a server-side FRED proxy (/wp-json/reprime/v1/rates) so the
 *      FRED API key is NEVER exposed in client JS. Cached 1h via a transient.
 *
 * FILE PLACEMENT: put reprime-viz.css, globe.js, charts.js, radar-dashboard.js,
 * deal-analyzer.js, heatmap.js into:  wp-content/themes/<your-child-theme>/reprime-viz/
 *
 * Highcharts note: Highcharts is a COMMERCIAL product — ensure you hold a
 * license for production use (or ask to swap charts.js to Chart.js/ApexCharts).
 * ========================================================================== */

/* ---- 1. Put your FRED key here (free at https://fred.stlouisfed.org) ----- */
if ( ! defined( 'REPRIME_FRED_KEY' ) ) {
    define( 'REPRIME_FRED_KEY', 'PASTE_YOUR_FRED_API_KEY_HERE' );
}

/* ---- 2. Enqueue assets (homepage only, deferred) ------------------------- */
add_action( 'wp_enqueue_scripts', function () {

    // Limit to the homepage so interior pages stay lean.
    if ( ! is_front_page() && ! is_home() ) {
        return;
    }

    $base = get_stylesheet_directory_uri() . '/reprime-viz/';
    $ver  = '1.0.0';
    $defer = array( 'in_footer' => true, 'strategy' => 'defer' ); // WP 6.3+

    // Shared styles
    wp_enqueue_style( 'reprime-viz', $base . 'reprime-viz.css', array(), $ver );
    // Google Fonts (Poppins + JetBrains Mono) — matches the brand readout font
    wp_enqueue_style( 'reprime-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap', array(), null );

    /* ---- CDN libraries (all free/open except Highcharts) ---- */
    wp_enqueue_script( 'rpv-three',      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', array(), 'r128', $defer );
    wp_enqueue_script( 'rpv-d3',         'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js',          array(), '7.9.0', $defer );
    wp_enqueue_script( 'rpv-highcharts', 'https://code.highcharts.com/highcharts.js',                          array(), '12', $defer ); // LICENSE REQUIRED
    wp_enqueue_script( 'rpv-react',      'https://unpkg.com/react@18/umd/react.production.min.js',              array(), '18', $defer );
    wp_enqueue_script( 'rpv-react-dom',  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',      array( 'rpv-react' ), '18', $defer );
    wp_enqueue_script( 'rpv-plot',       'https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/dist/plot.umd.min.js', array(), '0.6', $defer );

    /* ---- RePrime viz modules (each depends on its library) ---- */
    wp_enqueue_script( 'rpv-globe',    $base . 'globe.js',           array( 'rpv-three' ), $ver, $defer );
    wp_enqueue_script( 'rpv-charts',   $base . 'charts.js',          array( 'rpv-highcharts' ), $ver, $defer );
    wp_enqueue_script( 'rpv-radar',    $base . 'radar-dashboard.js', array( 'rpv-react', 'rpv-react-dom' ), $ver, $defer );
    wp_enqueue_script( 'rpv-analyzer', $base . 'deal-analyzer.js',   array( 'rpv-plot' ), $ver, $defer );
    wp_enqueue_script( 'rpv-heatmap',  $base . 'heatmap.js',         array( 'rpv-d3' ), $ver, $defer );
} );

/* ---- 3. FRED proxy: /wp-json/reprime/v1/rates ---------------------------- */
/* Keeps the API key server-side. charts.js fetches THIS, not FRED directly.   */
add_action( 'rest_api_init', function () {
    register_rest_route( 'reprime/v1', '/rates', array(
        'methods'             => 'GET',
        'permission_callback' => '__return_true',
        'callback'            => 'reprime_fred_rates',
    ) );
} );

function reprime_fred_rates() {
    // 1-hour cache so we never hammer FRED and the homepage stays fast.
    $cached = get_transient( 'reprime_fred_rates' );
    if ( $cached ) {
        return rest_ensure_response( $cached );
    }

    $key = REPRIME_FRED_KEY;
    $out = array( 'treasury' => array(), 'sofr' => array() );

    if ( $key && $key !== 'PASTE_YOUR_FRED_API_KEY_HERE' ) {
        // DGS10 = 10-Yr Treasury constant maturity; SOFR = secured overnight rate
        foreach ( array( 'treasury' => 'DGS10', 'sofr' => 'SOFR' ) as $bucket => $series ) {
            $url = add_query_arg( array(
                'series_id'        => $series,
                'api_key'          => $key,
                'file_type'        => 'json',
                'sort_order'       => 'desc',
                'limit'            => 12,
                'units'            => 'lin',
            ), 'https://api.stlouisfed.org/fred/series/observations' );

            $res = wp_remote_get( $url, array( 'timeout' => 8 ) );
            if ( ! is_wp_error( $res ) && 200 === wp_remote_retrieve_response_code( $res ) ) {
                $json = json_decode( wp_remote_retrieve_body( $res ), true );
                if ( ! empty( $json['observations'] ) ) {
                    $obs = array_reverse( $json['observations'] ); // chronological
                    foreach ( $obs as $o ) {
                        if ( $o['value'] !== '.' ) {
                            $out[ $bucket ][] = array( 'x' => substr( $o['date'], 0, 7 ), 'y' => floatval( $o['value'] ) );
                        }
                    }
                }
            }
        }
    }

    // Cache (even on partial/empty so a FRED outage doesn't stall every request).
    set_transient( 'reprime_fred_rates', $out, HOUR_IN_SECONDS );
    return rest_ensure_response( $out );
}
