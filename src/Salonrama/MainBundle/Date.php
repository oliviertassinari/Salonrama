<?php

namespace Salonrama\MainBundle;

class Date
{
    /**
     * A sweet interval formatting, will use the two biggest interval parts.
     * On small intervals, you get minutes and seconds.
     * On big intervals, you get months and days.
     * Only the two biggest parts are used.
     *
     * @param DateTime $start
     * @param DateTime|null $end
     * @return string
     */
    public static function formatDateDiff($start, $end = null)
    {
        if(!($start instanceof \DateTime)) {
            $start = new \DateTime($start);
        }

        if($end === null) {
            $end = new \DateTime();
        }

        if(!($end instanceof \DateTime)) {
            $end = new \DateTime($start);
        }

        $interval = $end->diff($start);
        $doPlural = function($nb,$str){
            if ($nb > 1) {
                switch ($str) {
                    case 'seconde':
                    case 'minute':
                    case 'jour':
                    case 'heure':
                    case 'année':
                        return $str.'s';
                    case 'mois':
                        return $str;
                }
            } else
                return $str;
        };

        $format = array();
        if($interval->y !== 0) {
            $format[] = "%y ".$doPlural($interval->y, "année");
        }
        if($interval->m !== 0) {
            $format[] = "%m ".$doPlural($interval->m, "mois");
        }
        if($interval->d !== 0) {
            $format[] = "%d ".$doPlural($interval->d, "jour");
        }
        if($interval->h !== 0) {
            $format[] = "%h ".$doPlural($interval->h, "heure");
        }
        if($interval->i !== 0) {
            $format[] = "%i ".$doPlural($interval->i, "minute");
        }
        if($interval->s !== 0) {
            $format[] = "%s ".$doPlural($interval->s, "seconde");
        }
       
        if(count($format)==0 || (count($format)==1 && $interval->s !== 0)) {
            return "Il y a moins d'une minute";
        }

        // We use the two biggest parts
        if(count($format) > 1) {
            $format = array_shift($format).", ".array_shift($format);
        } else {
            $format = array_pop($format);
        }

        // Prepend 'since ' or whatever you like
        return 'Il y a '.$interval->format($format);
    }
}

?>