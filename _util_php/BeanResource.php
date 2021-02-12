<?php

class BeanResource
{

    public $path;
    public $path_resource;
    public $path_scripts;
    public $path_styles;

    public function __construct($path, $path_resource, $path_scripts, $path_styles)
    {
        $this->path = $path;
        $this->path_resource = $path_resource;
        $this->path_scripts = $path_scripts;
        $this->path_styles = $path_styles;
    }
}