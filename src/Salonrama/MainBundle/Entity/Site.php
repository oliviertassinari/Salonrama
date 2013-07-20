<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Site
 *
 * @ORM\Table(name="site")
 * @ORM\Entity(repositoryClass="Salonrama\MainBundle\Entity\SiteRepository")
 */
class Site
{
    /**
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="theme", type="string", length=20)
     */
    private $theme;

    /**
     * @ORM\Column(name="loc_home_site", type="string", length=100)
     */
    private $locHomeSite;

    /**
     * @ORM\Column(name="subdomain", type="string", length=63)
     */
    private $subdomain;

    /**
     * @ORM\Column(name="image", type="string", length=65535)
     */
    private $image;

    /**
     * @ORM\Column(name="block", type="string", length=65535)
     */
    private $block;

    /**
     * @ORM\Column(name="page", type="string", length=16777215)
     */
    private $page;

    /**
     * @ORM\Column(name="data", type="string", length=65535)
     */
    private $data;

    /**
     * @ORM\Column(name="creation", type="datetime")
     */
    private $creation;

    /**
     * @ORM\Column(name="update", type="datetime")
     */
    private $update;

    /**
     * @ORM\Column(name="is_online", type="boolean")
     */
    private $isOnline;
}
