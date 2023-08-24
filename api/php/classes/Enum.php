<?php

interface Enum
{
    public static function isValid($status);
    public static function numOptions();
    public static function toString($num);
    public static function toArray();
}
