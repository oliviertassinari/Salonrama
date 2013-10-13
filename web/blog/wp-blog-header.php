<?php
/**
 * Loads the WordPress environment and template.
 *
 * @package WordPress
 */

if ( !isset($wp_did_header) ) {

	$wp_did_header = true;

	require_once( dirname(__FILE__) . '/wp-load.php' );

	// @HACK FABRICE
	// All variables defined here are considered global by WordPress
	$local_global_vars = get_defined_vars();
	foreach($local_global_vars as $local_name => $local_value)
	{
		$GLOBALS[$local_name] = $local_value;
	}
	// Don't create new global variables ourselves, and do not overwrite other global variables, for example $name...
	unset($local_name, $local_value, $local_global_vars);
	// @HACK FABRICE

	wp();

	// @HACK Fabrice
	global $posts;
	// @HACK Fabrice

	require_once( ABSPATH . WPINC . '/template-loader.php' );
}
