<?php

/*
 * This file is part of the Assetic package, an OpenSky project.
 *
 * (c) 2010-2013 OpenSky Project Inc
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Assetic\Filter;

use Assetic\Asset\AssetInterface;

/**
 * Filters assets through JSMin.
 *
 * All credit for the filter itself is mentioned in the file itself.
 *
 * @link https://raw.github.com/mrclay/minify/master/min/lib/JSMin.php
 * @author Brunoais <brunoaiss@gmail.com>
 */
class JSMinFilter implements FilterInterface
{
    public function filterLoad(AssetInterface $asset)
    {
    }

    public function filterDump(AssetInterface $asset)
    {
        $asset->setContent(JSMin::minify($asset->getContent()));
    }
}
