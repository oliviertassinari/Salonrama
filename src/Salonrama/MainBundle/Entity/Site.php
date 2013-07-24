<?php

namespace Salonrama\MainBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
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
     * @ORM\Column(name="block", type="string", length=16777215)
     */
    private $block;

    /**
     * @ORM\Column(name="page", type="string", length=65535)
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

    /**
     * Get id
     *
     * @return integer 
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set theme
     *
     * @param string $theme
     * @return Site
     */
    public function setTheme($theme)
    {
        $this->theme = $theme;
    
        return $this;
    }

    /**
     * Get theme
     *
     * @return string 
     */
    public function getTheme()
    {
        return $this->theme;
    }

    /**
     * Set locHomeSite
     *
     * @param string $locHomeSite
     * @return Site
     */
    public function setLocHomeSite($locHomeSite)
    {
        $this->locHomeSite = $locHomeSite;
    
        return $this;
    }

    /**
     * Get locHomeSite
     *
     * @return string 
     */
    public function getLocHomeSite()
    {
        return $this->locHomeSite;
    }

    /**
     * Set subdomain
     *
     * @param string $subdomain
     * @return Site
     */
    public function setSubdomain($subdomain)
    {
        $this->subdomain = $subdomain;
    
        return $this;
    }

    /**
     * Get subdomain
     *
     * @return string 
     */
    public function getSubdomain()
    {
        return $this->subdomain;
    }

    /**
     * Set image
     *
     * @param string $image
     * @return Site
     */
    public function setImage($image)
    {
        $this->image = $image;
    
        return $this;
    }

    /**
     * Get image
     *
     * @return string 
     */
    public function getImage()
    {
        return $this->image;
    }

    /**
     * Set block
     *
     * @param string $block
     * @return Site
     */
    public function setBlock($block)
    {
        $this->block = $block;
    
        return $this;
    }

    /**
     * Get block
     *
     * @return string 
     */
    public function getBlock()
    {
        return $this->block;
    }

    /**
     * Set page
     *
     * @param string $page
     * @return Site
     */
    public function setPage($page)
    {
        $this->page = $page;
    
        return $this;
    }

    /**
     * Get page
     *
     * @return string 
     */
    public function getPage()
    {
        return $this->page;
    }

    /**
     * Set data
     *
     * @param string $data
     * @return Site
     */
    public function setData($data)
    {
        $this->data = $data;
    
        return $this;
    }

    /**
     * Get data
     *
     * @return string 
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * Set creation
     *
     * @param \DateTime $creation
     * @return Site
     */
    public function setCreation($creation)
    {
        $this->creation = $creation;
    
        return $this;
    }

    /**
     * Get creation
     *
     * @return \DateTime 
     */
    public function getCreation()
    {
        return $this->creation;
    }

    /**
     * Set update
     *
     * @param \DateTime $update
     * @return Site
     */
    public function setUpdate($update)
    {
        $this->update = $update;
    
        return $this;
    }

    /**
     * Get update
     *
     * @return \DateTime 
     */
    public function getUpdate()
    {
        return $this->update;
    }

    /**
     * Set isOnline
     *
     * @param boolean $isOnline
     * @return Site
     */
    public function setIsOnline($isOnline)
    {
        $this->isOnline = $isOnline;
    
        return $this;
    }

    /**
     * Get isOnline
     *
     * @return boolean 
     */
    public function getIsOnline()
    {
        return $this->isOnline;
    }
}