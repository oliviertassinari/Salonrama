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
    protected $id;

    /**
     * @ORM\Column(name="theme", type="string", length=20)
     */
    protected $theme;

    /**
     * @ORM\Column(name="path_back", type="string", length=100)
     */
    protected $pathBack;

    /**
     * @ORM\Column(name="subdomain", type="string", length=63)
     */
    protected $subdomain;

    /**
     * @ORM\Column(name="image_list", type="string", length=65535)
     */
    protected $imageList;

    /**
     * @ORM\Column(name="block_list", type="string", length=16777215)
     */
    protected $blockList;

    /**
     * @ORM\Column(name="page_list", type="string", length=65535)
     */
    protected $pageList;

    /**
     * @ORM\Column(name="data_list", type="string", length=65535)
     */
    protected $dataList;

    /**
     * @ORM\Column(name="creation", type="datetime")
     */
    protected $creation;

    /**
     * @ORM\Column(name="last_update", type="datetime")
     */
    protected $lastUpdate;

    /**
     * @ORM\Column(name="is_online", type="boolean")
     */
    protected $isOnline;

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
     * Set pathBack
     *
     * @param string $pathBack
     * @return Site
     */
    public function setPathBack($pathBack)
    {
        $this->pathBack = $pathBack;
    
        return $this;
    }

    /**
     * Get pathBack
     *
     * @return string 
     */
    public function getPathBack()
    {
        return $this->pathBack;
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
     * Set imageList
     *
     * @param string $imageList
     * @return Site
     */
    public function setImageList($imageList)
    {
        $this->imageList = $imageList;
    
        return $this;
    }

    /**
     * Get imageList
     *
     * @return string 
     */
    public function getImageList()
    {
        return $this->imageList;
    }

    /**
     * Set blockList
     *
     * @param string $blockList
     * @return Site
     */
    public function setBlockList($blockList)
    {
        $this->blockList = $blockList;
    
        return $this;
    }

    /**
     * Get blockList
     *
     * @return string 
     */
    public function getBlockList()
    {
        return $this->blockList;
    }

    /**
     * Set pageList
     *
     * @param string $pageList
     * @return Site
     */
    public function setPageList($pageList)
    {
        $this->pageList = $pageList;
    
        return $this;
    }

    /**
     * Get pageList
     *
     * @return string 
     */
    public function getPageList()
    {
        return $this->pageList;
    }

    /**
     * Set dataList
     *
     * @param string $dataList
     * @return Site
     */
    public function setDataList($dataList)
    {
        $this->dataList = $dataList;
    
        return $this;
    }

    /**
     * Get dataList
     *
     * @return string 
     */
    public function getDataList()
    {
        return $this->dataList;
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
     * Set lastUpdate
     *
     * @param \DateTime $lastUpdate
     * @return Site
     */
    public function setLastUpdate($lastUpdate)
    {
        $this->lastUpdate = $lastUpdate;
    
        return $this;
    }

    /**
     * Get lastUpdate
     *
     * @return \DateTime 
     */
    public function getLastUpdate()
    {
        return $this->lastUpdate;
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